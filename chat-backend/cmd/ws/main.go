package main

import (
	"context"
	"log"
	"time"

	"chat/server"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const uri = "mongodb://mongo:mongo@chat_db:27017"

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal(err)
	}

	db := client.Database("chatdb")
	s := server.NewServer(db)
	defer s.Close()

	s.Start()
}
