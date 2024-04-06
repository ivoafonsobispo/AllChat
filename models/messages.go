package models

import "time"

type Message struct {
	Name    string    `json:"name"`
	Content string    `json:"content"`
	Time    time.Time `json:"time"`
}
