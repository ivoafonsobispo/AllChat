package main

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/ivoafonsobispo/accounts-backend/database"
	"github.com/ivoafonsobispo/accounts-backend/handlers"
	"github.com/ivoafonsobispo/accounts-backend/middlewares"
)

func main() {
	// Initialize database
	db := database.InitDB()

	// Create a Router
	router := mux.NewRouter()

	router.HandleFunc("/api/users", handlers.GetUsers(db.DB)).Methods("GET")
	router.HandleFunc("/api/users/{id}", handlers.GetUserDetails(db.DB)).Methods("GET")

	router.HandleFunc("/api/users", handlers.CreateUser(db.DB)).Methods("POST")
	router.HandleFunc("/api/users/login", handlers.Login(db.DB)).Methods("POST")

	router.HandleFunc("/api/users/{id}", handlers.UpdateUser(db.DB)).Methods("PUT")
	router.HandleFunc("/api/users/{id}", handlers.SoftDeleteUser(db.DB)).Methods("PATCH")
	router.HandleFunc("/api/users/{id}", handlers.HardDeleteUser(db.DB)).Methods("DELETE")

	router.HandleFunc("/api/groups", handlers.GetGroups(db.DB)).Methods("GET")
	router.HandleFunc("/api/groups/{id}", handlers.GetGroupDetails(db.DB)).Methods("GET")
	router.HandleFunc("/api/groups", handlers.CreateGroup(db.DB)).Methods("POST")

	// Handle the JSON
	enhancedRouter := middlewares.EnableCORS(middlewares.JSONContentTypeMiddleware(router))

	// Start Server
	http.ListenAndServe(":8000", enhancedRouter)
}
