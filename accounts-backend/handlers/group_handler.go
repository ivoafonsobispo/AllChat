package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
	"github.com/ivoafonsobispo/accounts-backend/models"
)

func GetGroupsAndUsers(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var groups []models.FixGroup

		rows, err := db.Query("SELECT g.id, g.name, g.is_pm_group, u.name FROM groups g INNER JOIN rel_user_group r ON  g.id=r.group_id INNER JOIN users u on u.id=r.user_id WHERE g.deleted = FALSE ORDER BY g.id ASC;")
		if err != nil {
			log.Println(err)
			http.Error(w, "Error getting groups", http.StatusBadRequest)
			return
		}
		defer rows.Close()
		var currentGroup models.FixGroup
		var oldString string
		var oldName string
		var oldPm bool
		currentGroup.Id = ""
		for rows.Next() {
			var tempUser string
			rows.Scan(&oldString, &oldName, &oldPm, &tempUser)
			if oldString != currentGroup.Id && currentGroup.Id != "" {
				groups = append(groups, currentGroup)

				currentGroup.Users = nil

			}
			currentGroup.Id = oldString
			currentGroup.Name = oldName
			currentGroup.Deleted = false
			currentGroup.IsDM = oldPm
			currentGroup.Users = append(currentGroup.Users, tempUser)
		}
		groups = append(groups, currentGroup)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(groups)
	}
}

/**
* @summary gets all the groups in an quick, summarized manner

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
} */

/*
Gets all the groups related to the user and the users also realted in those groups

	func GetPMGroups(db *sql.DB) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			vars := mux.Vars(r)
			id := vars["id"]

			var group models.Group
			rows, err := db.Query("SELECT rf.group_id, rf.user_id FROM rel_user_group rf WHERE rf.group_id IN (SELECT r.group_id FROM rel_user_group r WHERE r.user_id = $1) AND rf.is_pm_group = TRUE; ", id)

			if err != nil {
				log.Println(err)
				http.Error(w, "Error getting groups", http.StatusBadRequest)
				return
			}
			//defer rows.Close()
			for rows.Next() {
				var user models.UserDTO
				err := rows.Scan(&group.Id, &user.Id)
				if err != nil {
					log.Println(err)
					http.Error(w, "Error scanning groups", http.StatusBadRequest)
					return
				}
				group.Users = append(group.Users, models.UserDTO{Id: user.Id})
			}
			//now check

		}
	}
*/
func CheckPMGroup(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		var comp models.PMScomparator

		json.NewDecoder(r.Body).Decode(&comp)
		//for each string in comp get the user id
		var ids []int
		for _, id := range comp.Id_targ {
			var tempId int
			db.QueryRow("SELECT id FROM users WHERE name=$1", id).Scan(&tempId)

			ids = append(ids, tempId)
		}
		query, args, err := buildQuery(ids)
		if err != nil {
			log.Fatal(err)
		}
		log.Println(query)
		log.Println(args)
		var groups []models.Group
		rows, err := db.Query(query, args...)
		if err != nil {
			log.Println(err)
			http.Error(w, "Error getting groups", http.StatusBadRequest)
			return
		}
		//return rows in the form of text
		var currentGroup models.Group
		var oldString string
		currentGroup.Id = ""
		for rows.Next() {
			var tempUser models.UserDTO
			rows.Scan(&oldString, &tempUser.Id)
			if oldString != currentGroup.Id && currentGroup.Id != "" {
				groups = append(groups, currentGroup)
				//reset currentGroup

				currentGroup.Users = nil

			}
			currentGroup.Id = oldString
			currentGroup.Users = append(currentGroup.Users, tempUser)
		}
		var valid bool
		//Now check if groups has a group containing the exact same users
		//TODO go could have some functional stuff for arrays?
		for _, group := range groups {
			if len(group.Users) == len(ids) {
				//check if all users are in the group
				for _, user := range group.Users {
					//check if user is in the group
					for _, id := range ids {
						if user.Id == id {
							valid = true
							break
						}
					}
					if !valid {
						break
					}
				}

			}
			if valid {
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(group)
				return
			}
		}

		//return a blank json object
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode("Not Found")

		return
	}
}

// welp no dynamic queries in go... so we have to do this
func buildQuery(ids []int) (string, []interface{}, error) {
	// Create the placeholders for the IDs
	placeholders := make([]string, len(ids))
	args := make([]interface{}, len(ids))
	for i, id := range ids {
		placeholders[i] = fmt.Sprintf("$%d", i+1)
		args[i] = id
	}

	// Build the query string with the placeholders
	query := fmt.Sprintf(`
		SELECT rf.group_id, rf.user_id
		FROM rel_user_group rf
		WHERE rf.group_id IN (
			SELECT r.group_id
			FROM rel_user_group r
			WHERE rf.user_id IN (%s)
		)
		AND rf.is_pm_group = TRUE
		ORDER BY rf.group_id ASC
	`, strings.Join(placeholders, ", "))

	return query, args, nil
}

/**
* @summary gets the group details, along with the users in the group
 */
func GetGroupDetails(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id := vars["id"]

		var group models.Group
		group.Id = id
		//TODO shorten this
		rows, err := db.Query("SELECT r.user_id, u.name, r.name, r.is_pm_group FROM rel_user_group r INNER JOIN users u ON r.user_id = u.id WHERE r.Deleted = 'False' AND r.group_id=$1", id)
		if err != nil {
			log.Println(err)
			http.Error(w, "Error getting groups", http.StatusBadRequest)
			return
		}
		for rows.Next() {
			//grab names and append it to group.users
			var user models.User
			//TODO Bellow kinda sucks...
			err := rows.Scan(&user.Id, &user.Name, &group.Name, &group.IsDM)
			if err != nil {
				log.Println(err)
				http.Error(w, "Error scanning groups", http.StatusBadRequest)
				return
			}
			var userName models.UserDTO
			userName.Name = user.Name
			group.Users = append(group.Users, userName)

		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(group)
	}
}

/*
*
* @summary creates a group and associates users into it if they exist
 */
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

		err = db.QueryRow("INSERT INTO groups(name, is_pm_group) VALUES($1, $2) RETURNING id", group.Name, group.IsDM).Scan(&groupID)
		if err != nil {
			log.Println(err)
			http.Error(w, "Error creating group", http.StatusBadRequest)
			return
		}
		//foreach user in group create a entry in rel_user_group
		for _, user := range group.Users {
			//search the id by name
			var user_temp models.User
			//TODO: this is shyte, we should just search agrupated, or use id for usesrs or change postgres architecture
			db.QueryRow("SELECT id FROM users WHERE name=$1", user.Name).Scan(&user_temp.Id)

			_, err = db.Exec("INSERT INTO rel_user_group(user_id, group_id, name, is_pm_group) VALUES($1, $2, $3, $4)", user_temp.Id, groupID, group.Name, group.IsDM)
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
