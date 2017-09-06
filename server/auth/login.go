package auth

import (
	"database/sql"
	"errors"

	"github.com/fsufitch/gw2slots/server/db"
)

// ErrWrongPassword is a singleton error corresponding to a wrong password
var ErrWrongPassword = errors.New("wrong password")

// Login authenticates a user and returns a user object or relevant error
func Login(tx *sql.Tx, username string, password string) (*db.User, error) {
	user, err := db.GetUser(tx, username)
	if err == sql.ErrNoRows || user == nil {
		return nil, ErrWrongPassword
	} else if err != nil {
		return nil, err
	}

	if len(user.PasswordHash) > 0 {
		return user, nil
	}

	return nil, ErrWrongPassword
}
