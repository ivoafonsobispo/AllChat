package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/ivoafonsobispo/accounts-backend/database"
	"github.com/ivoafonsobispo/accounts-backend/handlers"
	"github.com/ivoafonsobispo/accounts-backend/middlewares"
)

func main() {
	// Initialize database
	db, err := database.InitDB()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Create a Router
	router := mux.NewRouter()

	router.HandleFunc("/api/users", handlers.GetUsers(db)).Methods("GET")
	router.HandleFunc("/api/users/{id}", handlers.GetUser(db)).Methods("GET")

	router.HandleFunc("/api/users", handlers.CreateUser(db)).Methods("POST")
	router.HandleFunc("/api/users/login", handlers.Login(db)).Methods("POST")

	router.HandleFunc("/api/users/{id}", handlers.UpdateUser(db)).Methods("PUT")

	router.HandleFunc("/api/users/{id}", handlers.DeleteUser(db)).Methods("DELETE")

	// Handle the JSON
	enhancedRouter := middlewares.EnableCORS(middlewares.JSONContentTypeMiddleware(router))

	// Start Server
	http.ListenAndServe(":8000", enhancedRouter)
}
