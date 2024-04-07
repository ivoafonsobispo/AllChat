package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func InitDB() (*sql.DB, error) {
	// Hardcoded connection credentials
	dbUser := "admin"
	dbPassword := "admin"
	dbName := "users"
	instanceConnectionName := "chat-app-419508:us-central1:accountsdb"

	// Create the DSN using the hardcoded credentials
	dsn := fmt.Sprintf("user=%s password=%s dbname=%s host=/cloudsql/%s sslmode=disable",
		dbUser, dbPassword, dbName, instanceConnectionName)

	// Connect to the database using the hardcoded credentials
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
