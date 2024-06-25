package server

import (
	"fmt"
	"io"
	"net/http"
	"time"

	"ws/models"
	"ws/utils"

	"golang.org/x/net/websocket"
)

type Server struct {
	conns map[string]map[*websocket.Conn]bool
}

func NewServer() *Server {
	return &Server{
		conns: make(map[string]map[*websocket.Conn]bool),
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

	groupId := ws.Request().URL.Query().Get("groupId")

	if _, ok := s.conns[groupId]; !ok {
		s.conns[groupId] = make(map[*websocket.Conn]bool)
	}
	s.conns[groupId][ws] = true

	defer func() {
		delete(s.conns[groupId], ws)
		ws.Close()
	}()

	s.parseMessage(ws, groupId)
}

func (s *Server) parseMessage(ws *websocket.Conn, groupId string) {
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

		const layout = "Mon Jan 2 15:04"
		timestamp := time.Now().Format(layout)

		messageStr := fmt.Sprintf("(%s) %s: %s", timestamp, msg.Username, msg.Content)
		messageBytes := []byte(messageStr)
		s.sendMessageToWebsocket(messageBytes, groupId)
	}
}

func (s *Server) sendMessageToWebsocket(b []byte, groupId string) {
	conns, ok := s.conns[groupId]
	if !ok {
		fmt.Printf("No connections found for group %s\n", groupId)
		return
	}

	for ws := range conns {
		go func(ws *websocket.Conn) {
			if _, err := ws.Write(b); err != nil {
				fmt.Println("write error:", err)
			}
		}(ws)
	}
}
