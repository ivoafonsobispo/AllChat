package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"github.com/ivoafonsobispo/accounts-backend/models"

)
// get router.HandleFunc("/api/groups", handlers.CreateGroup(db.DB)).Methods("POST") 
func GetGroups(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var group models.Group
		groups := []models.Group{}
		rows, err := db.Query("SELECT id, name FROM groups WHERE Deleted = 'False'")
		if err != nil {
			log.Println(err)
			http.Error(w, "Error getting groups", http.StatusBadRequest)
			return
		}
		defer rows.Close()
		for rows.Next() {
			err := rows.Scan(&group.Id, &group.Name)
			if err != nil {
				log.Println(err)
				http.Error(w, "Error scanning groups", http.StatusBadRequest)
				return
			}
			groups = append(groups, group)
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(groups)
	}
}

// router.HandleFunc("/api/groups", handlers.GetGroups(db.DB)).Methods("GET")
func CreateGroup(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var group models.Group
		var groupID string
		err := json.NewDecoder(r.Body).Decode(&group)
		if err != nil {
			log.Println(err)
			http.Error(w, "Error decoding request body", http.StatusBadRequest)
			return
		}

		err = db.QueryRow("INSERT INTO groups(name) VALUES($1) RETURNING id", group.Name).Scan(&groupID)
		if err != nil {
			log.Println(err)
			http.Error(w, "Error creating group", http.StatusBadRequest)
			return
		}
		//foreach user in group create a entry in rel_user_group
		for _, user := range group.Users {
			_, err = db.Exec("INSERT INTO rel_user_group(user_name, group_id) VALUES($1, $2)", user.Name, groupID)
			if err != nil {
				log.Println(err)
				http.Error(w, "Error creating group", http.StatusBadRequest)
				return
			}
		}


		group.Id = groupID


		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(group)
	}
}

//router.HandleFunc("/api/groups/{id}", handlers.GetGroup(db.DB)).Methods("GET")
