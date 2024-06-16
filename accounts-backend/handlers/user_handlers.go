package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/ivoafonsobispo/accounts-backend/models"
	"golang.org/x/crypto/bcrypt"
)

func Login(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var u models.User
		json.NewDecoder(r.Body).Decode(&u)

		var dbUser models.User
		err := db.QueryRow("SELECT id, name, password FROM users WHERE name = $1 AND deleted = FALSE", u.Name).Scan(&dbUser.Id, &dbUser.Name, &dbUser.Password)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		}

		err = bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(u.Password))
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		}

		json.NewEncoder(w).Encode(dbUser)
	}
}

func GetUsers(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT id, name, password FROM users WHERE deleted = FALSE")
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()

		users := []models.User{} // array of users
		for rows.Next() {
			var u models.User
			if err := rows.Scan(&u.Id, &u.Name, &u.Password); err != nil {
				log.Fatal(err)
			}
			users = append(users, u)
		}
		if err := rows.Err(); err != nil {
			log.Fatal(err)
		}

		json.NewEncoder(w).Encode(users)
	}
}

/**
* @summary gets the user details, along with the groups the user is in
 */

func GetUserDetails(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id := vars["id"]

		var u models.UserDetailedDTO
		u.Id = -1
		rows, err := db.Query("SELECT u.id, u.name, u.password, r.group_id, r.name, r.deleted FROM users u INNER JOIN rel_user_group r ON r.user_id = u.id WHERE u.id = $1 AND u.deleted = FALSE", id)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		}
		for rows.Next() {
			/*if u.Id == -1 {
				rows.Scan(&u.Id, &u.Name, &u.Deleted)
			//TODO: bellow might be inneficient
				}*/
			//grab id and append it to user.groups
			var group models.GroupDTO

			err := rows.Scan(&u.Id, &u.Name, &u.Password, &group.Id, &group.Name, &group.Deleted)
			if err != nil {
				log.Println(err)
				http.Error(w, "Error scanning groups", http.StatusBadRequest)
				return
			}

			u.Groups = append(u.Groups, group)

		}

		json.NewEncoder(w).Encode(u)
	}
}

func CreateUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var u models.User
		json.NewDecoder(r.Body).Decode(&u)

		// Check if the username already exists
		var usernameExists bool
		err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE name=$1 AND deleted = FALSE)", u.Name).Scan(&usernameExists)
		if err != nil {
			log.Fatal(err)
		}

		if usernameExists {
			http.Error(w, "Username already exists", http.StatusBadRequest)
			return
		}

		// Cypher the password
		hash, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
		if err != nil {
			log.Fatal(err)
		}

		u.Password = string(hash)

		err = db.QueryRow("INSERT INTO users (name, password) VALUES ($1, $2) RETURNING id", u.Name, u.Password).Scan(&u.Id)
		if err != nil {
			log.Fatal(err)
		}

		json.NewEncoder(w).Encode(u)
	}
}

func UpdateUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var u models.User
		json.NewDecoder(r.Body).Decode(&u)

		vars := mux.Vars(r)
		id := vars["id"]

		// Cypher the password
		hash, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
		if err != nil {
			log.Fatal(err)
		}

		// Execute the update query
		_, err = db.Exec("UPDATE users SET name = $1, email = $2 WHERE id = $3 AND deleted = FALSE", u.Name, hash, id)
		if err != nil {
			log.Fatal(err)
		}

		// Retrieve the updated user data from the database
		var updatedUser models.User
		err = db.QueryRow("SELECT id, name, email FROM users WHERE id = $1 AND deleted = FALSE", id).Scan(&updatedUser.Id, &updatedUser.Name, &updatedUser.Password)
		if err != nil {
			log.Fatal(err)
		}

		// Send the updated user data in the response
		json.NewEncoder(w).Encode(updatedUser)
	}
}

func HardDeleteUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id := vars["id"]

		var u models.User
		err := db.QueryRow("SELECT * FROM users WHERE id = $1", id).Scan(&u.Id, &u.Name, &u.Password)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		} else {
			_, err := db.Exec("DELETE FROM users WHERE id = $1", id)
			if err != nil {
				//todo : fix error handling
				w.WriteHeader(http.StatusNotFound)
				return
			}

			json.NewEncoder(w).Encode("User deleted")
		}
	}
}
func SoftDeleteUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id := vars["id"]

		var u models.User
		err := db.QueryRow("SELECT * FROM users WHERE id = $1 AND deleted = FALSE", id).Scan(&u.Id, &u.Name, &u.Password)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		} else {
			_, err := db.Exec("UPDATE users SET deleted = 'True' WHERE id = $1", id)
			if err != nil {
				//todo : fix error handling
				w.WriteHeader(http.StatusNotFound)
				return
			}

			json.NewEncoder(w).Encode("User deleted")
		}
	}
}
