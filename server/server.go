// server/server.go
package server

import (
	"fmt"
	"io"
	"net/http"

	"ws/models"
	"ws/utils"

	"golang.org/x/net/websocket"
)

type Server struct {
	conns map[*websocket.Conn]bool
}

func NewServer() *Server {
	return &Server{
		conns: make(map[*websocket.Conn]bool),
	}
}

func (s *Server) Start() {
	http.Handle("/chat", utils.HandleCORS(websocket.Handler(s.handleWS)))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Server is running!")
	})
	http.ListenAndServe(":8001", nil)
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
