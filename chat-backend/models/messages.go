package models

import "time"

type ReceivedMessage struct {
	GroupId string  `json:"groupid"`
	Message Message `json:"message"`
}

type RetrieveMessages struct {
	GroupId  string    `json:"groupid"`
	Messages []Message `json:"messages"`
}

type Message struct {
	Content   string    `json:"content"`
	Username  string    `json:"username"`
	Timestamp time.Time `json:"timestamp"`
}
