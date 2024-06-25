package handlers

import (
	"log"
	"net/http"
	"time"

	"github.com/clerkinc/clerk-sdk-go/clerk"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		sessionClaims, ok := clerk.SessionFromContext(r.Context())
		if ok {
			//check if its expired
			if sessionClaims.Expiry.Time().Before(time.Now()) {
				//return error
				http.Error(w, "Session Expired", http.StatusUnauthorized)
			}
			next.ServeHTTP(w, r)

		} else {
			log.Println("Unauthorized")
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
		}
	})
}
