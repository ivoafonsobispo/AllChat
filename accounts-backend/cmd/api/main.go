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

	router.HandleFunc("/api/groups", handlers.GetGroupsAndUsers(db.DB)).Methods("GET")
	router.HandleFunc("/api/groups/{id}", handlers.GetGroupDetails(db.DB)).Methods("GET")
	router.HandleFunc("/api/groups", handlers.CreateGroup(db.DB)).Methods("POST")

	router.HandleFunc("/api/pms", handlers.CheckPMGroup(db.DB)).Methods("POST")

	// Initialize Clerk TODO MOVE THIS ELSEWHERE FOR CLEANER STRUCTURE
	/*var apiKey string
	apiKey = os.Getenv("CLERK_SECRET_API_KEY")
	publicKey := os.Getenv("CLERK_PUBLIC_API_KEY")
	if len(apiKey) == 0 || len(publicKey) == 0 {
		log.Println("Please set the CLERK_SECRET_API_KEY and CLERK_PUBLIC_API_KEY environment variables somewhere on Docker")
		log.Println("Falling Back on config files in case of local development")
		//Read clerk.json
		file, err := os.Open("clerk.json")
		if err != nil {
			panic(err)
		}
		defer file.Close()
		var apiConfig models.ClerkConfig
		json.NewDecoder(file).Decode(&apiConfig)
		apiKey = apiConfig.SecretKey
		publicKey = apiConfig.PublicKey
		if len(apiKey) == 0 || len(publicKey) == 0 {
			panic("FAILED...Please set the CLERK_SECRET_API_KEY and CLERK_PUBLIC_API_KEY environment variables")
		}
		log.Println("Successfully imported 2 strings from clerk.json")
	}

	client, err := clerk.NewClient(apiKey)
	if err != nil {
		panic(err)
	}

	injectActiveSession := clerk.WithSessionV2(client)

	router.Use(injectActiveSession)
	//router.Use(middlewares.AuthMiddleware)
	*/
	// Handle the JSON
	enhancedRouter := middlewares.EnableCORS(middlewares.JSONContentTypeMiddleware(router))

	// Start Server
	http.ListenAndServe(":8000", enhancedRouter)
}
