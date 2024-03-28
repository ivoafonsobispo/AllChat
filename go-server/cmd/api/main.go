package main

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/ivoafonsobispo/go-server/database"
	"github.com/ivoafonsobispo/go-server/handlers"
	"github.com/ivoafonsobispo/go-server/middlewares"
)

func main() {
	// Initialize database
	db := database.InitDB()

	// Create a Router
	router := mux.NewRouter()
	router.HandleFunc("/api/go/users/login", handlers.Login(db.DB)).Methods("POST")
	router.HandleFunc("/api/go/users", handlers.GetUsers(db.DB)).Methods("GET")
	router.HandleFunc("/api/go/users", handlers.CreateUser(db.DB)).Methods("POST")
	router.HandleFunc("/api/go/users/{id}", handlers.GetUser(db.DB)).Methods("GET")
	router.HandleFunc("/api/go/users/{id}", handlers.UpdateUser(db.DB)).Methods("PUT")
	router.HandleFunc("/api/go/users/{id}", handlers.DeleteUser(db.DB)).Methods("DELETE")

	// Handle the JSON
	enhancedRouter := middlewares.EnableCORS(middlewares.JSONContentTypeMiddleware(router))

	// Start Server
	http.ListenAndServe(":8000", enhancedRouter)
}
