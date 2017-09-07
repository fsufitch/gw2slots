package auth

import (
	"database/sql"
	"net/http"
	"strings"

	"github.com/fsufitch/gw2slots/server/db"
)

// AuthorizationFailedError is a type of error when authorization failed entirely
type AuthorizationFailedError struct {
	Reason string
}

func (e AuthorizationFailedError) Error() string {
	return "authorization failed: " + e.Reason
}

func extractAuthTokenFromRequest(r *http.Request) (string, error) {
	authFields := strings.Fields(r.Header.Get("Authorization"))
	if len(authFields) != 2 || authFields[0] != "Bearer" {
		return "", &AuthorizationFailedError{"Improper `Bearer` Authorization header"}
	}
	return authFields[1], nil
}

// UserForRequest returns the relevant "current" user for the given HTTP request
func UserForRequest(tx *sql.Tx, r *http.Request) (*db.User, error) {
	authTokenString, err := extractAuthTokenFromRequest(r)
	if err != nil {
		return nil, err
	}
	authToken, err := db.GetAuthToken(tx, authTokenString, false)
	if err != nil {
		return nil, AuthorizationFailedError{err.Error()}
	}

	user, err := db.GetUser(tx, authToken.Username)
	if err != nil {
		return nil, AuthorizationFailedError{err.Error()}
	}

	return user, nil
}
