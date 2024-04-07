package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
)

type DB struct {
	*sql.DB
}

func InitDB() *DB {
	mustGetenv := func(k string) string {
		v := os.Getenv(k)
		if v == "" {
			log.Fatalf("%s environment variable not set", k)
		}
		return v
	}

	var (
		dbUser                 = mustGetenv("DB_USER")
		dbPwd                  = mustGetenv("DB_PASSWORD")
		dbName                 = mustGetenv("DB_NAME")
		instanceConnectionName = mustGetenv("INSTANCE_CONNECTION_NAME")
	)

	dbURI := fmt.Sprintf("user=%s password=%s dbname=%s host=/cloudsql/%s sslmode=disable",
		dbUser, dbPwd, dbName, instanceConnectionName)

	db, err := sql.Open("postgres", dbURI)
	if err != nil {
		log.Fatalf("sql.Open: %v", err)
	}

	_, err = db.Exec("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT UNIQUE, password TEXT)")
	if err != nil {
		log.Fatalf("Failed to create table: %v", err)
	}

	return &DB{db}
}
