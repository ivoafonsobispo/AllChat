package main

import (
	"context"
	"log"
	"os"
	"time"

	"chat/server"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const dbName = "chatdb"

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	uri := os.Getenv("DATABASE_URL")
	if uri == "" {
		log.Fatal("DATABASE_URL not set")
	}

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal(err)
	}

	db := client.Database(dbName)
	s := server.NewServer(db)
	defer s.Close()

	s.Start()
}
