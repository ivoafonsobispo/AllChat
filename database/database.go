package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

func InitDB() (*sql.DB, error) {
	// Get the instance connection name from the environment
	instanceConnectionName := os.Getenv("INSTANCE_CONNECTION_NAME")
	if instanceConnectionName == "" {
		return nil, fmt.Errorf("INSTANCE_CONNECTION_NAME not set")
	}

	// Create the DSN using the Cloud SQL Proxy
	dsn := fmt.Sprintf("postgres://%s:%s@%s/%s?sslmode=disable",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		instanceConnectionName,
		os.Getenv("DB_NAME"),
	)

	// Connect to the database using the proxy
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}

	// Test the connection
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("unable to connect to database: %v", err)
	}

	log.Println("Connected to Cloud SQL database")

	return db, nil
}
