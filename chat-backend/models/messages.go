package models

import "time"

type Message struct {
	Content   string    `json:"content"`
	Username  string    `json:"username"`
	Timestamp time.Time `json:"timestamp"`
}

type ReceivedMessage struct {
	GroupId string  `json:"groupid"`
	Message Message `json:"message"`
}

type GroupMessages struct {
	GroupId  string    `json:"groupid"`
	Messages []Message `json:"messages"`
}
