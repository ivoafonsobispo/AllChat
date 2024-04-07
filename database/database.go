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
	mustGetenv := func(k string) string {
		v := os.Getenv(k)
		if v == "" {
			log.Fatalf("%s environment variable not set", k)
		}
		return v
	}

	var (
		dbUser         = mustGetenv("DB_USER")
		dbPwd          = mustGetenv("DB_PASSWORD")
		unixSocketPath = "/cloudsql/" + mustGetenv("INSTANCE_CONNECTION_NAME")
		dbName         = mustGetenv("DB_NAME")
	)

	dbURI := fmt.Sprintf("user=%s password=%s database=%s host=%s",
		dbUser, dbPwd, dbName, unixSocketPath)

	dbPool, err := sql.Open("postgres", dbURI)
	if err != nil {
		log.Fatalf("sql.Open: %v", err)
	}

	_, err = dbPool.Exec("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT UNIQUE, password TEXT)")
	if err != nil {
		log.Fatalf("Failed to create table: %v", err)
	}

	return &DB{dbPool}
}
