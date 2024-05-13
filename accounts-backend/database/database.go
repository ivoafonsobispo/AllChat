package database

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/lib/pq"
)

type DB struct {
	*sql.DB
}

func InitDB() *DB {
	// Connect to DB
	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal(err)
	}
	//open ../sql/Scheme.sql and execute it
	// get string from sql/Scheme.sql
	scheme, err := os.ReadFile("/Scheme.sql")
	if err != nil {
		log.Fatal(err)
	}
	
	_, err = db.Exec(string(scheme))
	if err != nil {
		log.Fatal(err)
	}
	
	return &DB{db}
}
