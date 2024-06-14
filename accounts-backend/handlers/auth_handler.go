package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/clerkinc/clerk-sdk-go/clerk"
)

// Call it before starting to listen to the port

func returnActiveSession() http.HandlerFunc {
	sessionClaims, ok := clerk.SessionFromContext(req.Context())
	if ok {
		jsonResp, _ := json.Marshal(sessionClaims)
		fmt.Fprintf(w, string(jsonResp))
	} else {
		// handle non-authenticated user
	}

}
