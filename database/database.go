package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

type DB struct {
	*sql.DB
}

func InitDB() *DB {
	// Get the instance connection name from the environment
	instanceConnectionName := os.Getenv("INSTANCE_CONNECTION_NAME")
	if instanceConnectionName == "" {
		log.Fatal("INSTANCE_CONNECTION_NAME not set")
	}

	// Get the database name, user, and password from the environment
	dbName := os.Getenv("DB_NAME")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")

	// Create the connection string
	dbURI := fmt.Sprintf("user=%s password=%s dbname=%s host=/cloudsql/%s sslmode=disable", dbUser, dbPassword, dbName, instanceConnectionName)

	// Connect to the database
	db, err := sql.Open("postgres", dbURI)
	if err != nil {
		log.Fatal(err)
	}

	// Create table if it doesn't exist
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT UNIQUE, password TEXT)")
	if err != nil {
		log.Fatal(err)
	}

	return &DB{db}
}
