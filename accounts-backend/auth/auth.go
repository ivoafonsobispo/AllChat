package auth

import (
	"log"
	"os"

	"github.com/gorilla/sessions"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/google"
)

const (
	key    = "nZd4KBg2L7FX7JzV9L8F4aO8V9pEJ7aP1qR2t8X1rL4="
	MaxAge = 86400 * 30
	IsProd = false
)

func NewAuth() {
	googleClientId := os.Getenv("GOOGLE_CLIENT_ID")
	googleClientSecret := os.Getenv("GOOGLE_CLIENT_SECRET")
	log.Println("Google Client ID: ", googleClientId)
	log.Println("Google Client Secret: ", googleClientSecret)
	store := sessions.NewCookieStore([]byte(key))
	store.MaxAge(MaxAge)
	store.Options.Path = "/"
	store.Options.HttpOnly = true
	store.Options.Secure = IsProd

	gothic.Store = store
	goth.UseProviders(google.New(googleClientId, googleClientSecret, "http://localhost:8000/auth/google/callback"))

}
