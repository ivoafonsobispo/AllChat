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
	http.HandleFunc("/chat", utils.HandleCORS(http.HandlerFunc(s.handleChat)))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Server is running!")
	})
	http.ListenAndServe(":8003", nil)
}

func (s *Server) Close() {
	if s.db != nil {
		err := s.db.Client().Disconnect(context.Background())
		if err != nil {
			fmt.Println("Error closing database connection:", err)
		}
	}
}

func (s *Server) handleChat(w http.ResponseWriter, r *http.Request) {
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
