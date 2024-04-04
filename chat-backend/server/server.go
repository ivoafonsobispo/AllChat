// server/server.go
package server

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"time"

	"chat/models"
	"chat/utils"

	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/net/websocket"
)

type Server struct {
	conns   map[*websocket.Conn]bool
	db      *mongo.Database
	message *mongo.Collection
}

func NewServer(db *mongo.Database) *Server {
	message := db.Collection("messages")

	return &Server{
		conns:   make(map[*websocket.Conn]bool),
		db:      db,
		message: message,
	}
}

func (s *Server) Start() {
	http.Handle("/chat", utils.HandleCORS(websocket.Handler(s.handleWS)))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Server is running!")
	})
	http.ListenAndServe(":8001", nil)
}

func (s *Server) Close() {
	if s.db != nil {
		err := s.db.Client().Disconnect(context.Background())
		if err != nil {
			fmt.Println("Error closing database connection:", err)
		}
	}
}

func (s *Server) handleWS(ws *websocket.Conn) {
	fmt.Println("New incoming connect from client:", ws.RemoteAddr())
	s.conns[ws] = true
	s.readLoop(ws)
}

func (s *Server) readLoop(ws *websocket.Conn) {
	for {
		var msg models.Message
		err := websocket.JSON.Receive(ws, &msg)
		if err != nil {
			if err == io.EOF {
				break
			}
			fmt.Println("Read error:", err)
			continue
		}
		messageStr := fmt.Sprintf("%s: %s", msg.Name, msg.Content)
		messageBytes := []byte(messageStr)
		s.broadcast(messageBytes)

		msg.Time = time.Now()
		s.saveMessage(msg)
	}
}

func (s *Server) saveMessage(msg models.Message) {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	_, err := s.message.InsertOne(ctx, msg)
	if err != nil {
		fmt.Println("Error saving message:", err)
	}
}

func (s *Server) broadcast(b []byte) {
	for ws := range s.conns {
		go func(ws *websocket.Conn) {
			if _, err := ws.Write(b); err != nil {
				fmt.Println("write error:", err)
			}
		}(ws)
	}
}
