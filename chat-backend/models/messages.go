package models

import "time"

type ReceiveMessage struct {
	GroupId string  `json:"group-id"`
	Message Message `json:"message"`
}

type RetrieveMessages struct {
	GroupId string    `json:"group-id"`
	Message []Message `json:"messages"`
}

type Message struct {
	Content   string    `json:"content"`
	Username  string    `json:"username"`
	Timestamp time.Time `json:"timestamp"`
}
