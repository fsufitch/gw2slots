package auth

import (
	"database/sql"
	"encoding/base64"
	"errors"
	"fmt"
	"net"
	"net/http"
	"strings"
	"time"
	"unicode"

	"github.com/fsufitch/gw2slots/server/db"
	uuid "github.com/satori/go.uuid"
)

var sessionDuration = 3 * 24 * time.Hour

// ErrWrongPassword is a singleton error corresponding to a wrong password
var ErrWrongPassword = errors.New("wrong password")

// ValidateCredentials authenticates a user and returns a user object or relevant error
func ValidateCredentials(tx *sql.Tx, username string, password string) (*db.User, error) {
	user, err := db.GetUser(tx, username)
	if err == sql.ErrNoRows || user == nil {
		return nil, ErrWrongPassword
	} else if err != nil {
		return nil, err
	}

	inputHash := SecureHash(password, user.PasswordSalt)
	if len(inputHash) != len(user.PasswordHash) {
		return nil, ErrWrongPassword
	}
	for i := range inputHash {
		if inputHash[i] != user.PasswordHash[i] {
			return nil, ErrWrongPassword
		}
	}

	return user, nil
}

// GetClientID returns a string identifying a user client
func GetClientID(r *http.Request) string {
	host, _, _ := net.SplitHostPort(r.RemoteAddr)

	xff := strings.FieldsFunc(r.Header.Get("X-Forwarded-For"), func(r rune) bool {
		return r == ',' || unicode.IsSpace(r)
	})
	if len(xff) > 0 {
		host = xff[0]
	}

	clientIDRaw := fmt.Sprintf("%s ++ %s", host, r.UserAgent())

	return base64.StdEncoding.EncodeToString([]byte(clientIDRaw))
}

// GetOrCreateAuthToken retrieves a valid token or creates one for the given user/clientID
func GetOrCreateAuthToken(tx *sql.Tx, username string, clientID string) (*db.AuthToken, error) {
	tokens, err := db.GetValidAuthTokensForUser(tx, username)
	if err != nil {
		return nil, err
	}

	var validToken *db.AuthToken
	for _, token := range tokens {
		if token.ClientID == clientID {
			validToken = &token
			break
		}
	}

	if validToken == nil {
		tokenString := uuid.NewV1().String()
		expiration := time.Now().Add(sessionDuration)
		validToken, err = db.CreateAuthToken(tx, tokenString, username, clientID, expiration)
	}

	return validToken, err
}
