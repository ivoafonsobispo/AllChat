// server/server.go
package server

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"chat/models"
	"chat/utils"

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
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		_, err := fmt.Fprintf(w, "Server is running!")
		if err != nil {
			return
		}
	})

	err := http.ListenAndServe(addr, nil)
	if err != nil {
		return
	}

	s.routes()
}

func (s *Server) routes() {
	http.HandleFunc("/chat", utils.HandleCORS(http.HandlerFunc(s.handleBroadcastChat)))
	http.HandleFunc("/chat/{groupId}", utils.HandleCORS(http.HandlerFunc(s.handleBroadcastChat)))
}

func (s *Server) Close() {
	if s.db != nil {
		err := s.db.Client().Disconnect(context.Background())
		if err != nil {
			fmt.Println("Error closing database connection:", err)
		}
	}
}

func (s *Server) handleBroadcastChat(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var msg models.Message
	err := json.NewDecoder(r.Body).Decode(&msg)
	if err != nil {
		http.Error(w, "Error decoding message", http.StatusBadRequest)
		return
	}

	msg.Time = time.Now()
	s.saveMessage(msg)
}

func (s *Server) saveMessage(msg models.Message) {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	_, err := s.message.InsertOne(ctx, msg)
	if err != nil {
		fmt.Println("Error saving message:", err)
	}
}
