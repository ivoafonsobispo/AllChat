package server

import (
	"chat/models"
	"chat/utils"
	"context"
	"encoding/json"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"net/http"
	"strings"

	"go.mongodb.org/mongo-driver/mongo"
)

const addr = ":8002"

type Server struct {
	db      *mongo.Database
	message *mongo.Collection
}

func NewServer(db *mongo.Database) *Server {
	message := db.Collection("messages")

	return &Server{
		db:      db,
		message: message,
	}
}

func (s *Server) Start() {
	s.routes()

	err := http.ListenAndServe(addr, nil)
	if err != nil {
		return
	}
}

func (s *Server) routes() {
	http.HandleFunc("/chat/{groupId}", utils.HandleCORS(http.HandlerFunc(s.handleGetMessagesGroup)))
	http.HandleFunc("/chat", utils.HandleCORS(http.HandlerFunc(s.handlePostMessageGroup)))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		_, err := fmt.Fprintf(w, "Server is running!")
		if err != nil {
			return
		}
	})
}

func (s *Server) Close() {
	if s.db != nil {
		err := s.db.Client().Disconnect(context.Background())
		if err != nil {
			fmt.Println("Error closing database connection:", err)
		}
	}
}

func (s *Server) handlePostMessageGroup(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var receivedMessage models.ReceivedMessage

	filter := bson.M{"groupid": receivedMessage.GroupId}
	update := bson.M{
		"$push": bson.M{
			"messages": receivedMessage.Message,
		},
	}
	options := options.Update().SetUpsert(true) // Create document if it doesn't exist

	_, err := s.message.UpdateOne(context.Background(), filter, update, options)
	if err != nil {
		http.Error(w, "Error adding to collection", http.StatusBadRequest)
	}
}

func (s *Server) handleGetMessagesGroup(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Get /{groupId} from URL
	groupId := strings.TrimPrefix(r.URL.Path, "/chat/")
	filter := bson.D{{"groupid", groupId}}

	// Get Message from DB
	var messages models.GroupMessages
	err := s.message.FindOne(context.Background(), filter).Decode(&messages)
	if err != nil {
		http.Error(w, "Error retrieving GroupID from DB", http.StatusConflict)
	}

	// Create JSON
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(messages)
	if err != nil {
		http.Error(w, "Error encoding JSON", http.StatusConflict)
	}
}
