package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
)

func InitDB() (*sql.DB, error) {
	// Get the instance connection name from the environment
	instanceConnectionName := os.Getenv("INSTANCE_CONNECTION_NAME")
	if instanceConnectionName == "" {
		return nil, fmt.Errorf("INSTANCE_CONNECTION_NAME not set")
	}

	// Create the DSN using the Cloud SQL Proxy
	dsn := fmt.Sprintf("host=/cloudsql/%s", instanceConnectionName)

	// Connect to the database using the proxy
	db, err := sql.Open("cloudsqlpostgres", dsn)
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
