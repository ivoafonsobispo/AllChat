package database

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

type DB struct {
	*sql.DB
}

func InitDB() *DB {
	// Hardcoded connection string
	dbURL := "/cloudsql/chat-app-419508:us-central1:accountsdb"

	// Connect to DB using the hardcoded connection string
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal(err)
	}

	// Create table if it doesn't exist with id, username, and password
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT UNIQUE, password TEXT)")
	if err != nil {
		log.Fatal(err)
	}

	return &DB{db}
}
