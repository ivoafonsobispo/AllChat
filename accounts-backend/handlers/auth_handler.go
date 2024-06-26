package handlers

import (
	"context"
	"database/sql"
	"fmt"
	"html/template"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/markbates/goth/gothic"
)

var userTemplate = `
<p><a href="/logout/{{.Provider}}">logout</a></p>
<p>Name: {{.Name}} [{{.LastName}}, {{.FirstName}}]</p>
<p>Email: {{.Email}}</p>
<p>NickName: {{.NickName}}</p>
<p>Location: {{.Location}}</p>
<p>AvatarURL: {{.AvatarURL}} <img src="{{.AvatarURL}}"></p>
<p>Description: {{.Description}}</p>
<p>UserID: {{.UserID}}</p>
<p>AccessToken: {{.AccessToken}}</p>
<p>ExpiresAt: {{.ExpiresAt}}</p>
<p>RefreshToken: {{.RefreshToken}}</p>
`
var callb = "http://localhost:3000"

func AuthCallback(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		provider := vars["provider"]

		r = r.WithContext(context.WithValue(context.Background(), "provider", provider))
		user, err := gothic.CompleteUserAuth(w, r)

		if err != nil {
			fmt.Fprintln(w, err)
			return
		}
		log.Println(user)

		http.Redirect(w, r, callb, http.StatusTemporaryRedirect)

	}
}

// logout
func Logout(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		gothic.Logout(w, r)
		http.Redirect(w, r, callb, http.StatusTemporaryRedirect)
	}
}

func EntryPoint(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		//try to get the user without re-authenticating
		vars := mux.Vars(r)
		provider := vars["provider"]
		r = r.WithContext(context.WithValue(context.Background(), "provider", provider))
		if gothUser, err := gothic.CompleteUserAuth(w, r); err == nil {
			t, _ := template.New("foo").Parse(userTemplate)
			t.Execute(w, gothUser)
		} else {
			gothic.BeginAuthHandler(w, r)
		}
	}
}
