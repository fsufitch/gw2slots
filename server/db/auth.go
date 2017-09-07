package db

import (
	"database/sql"
	"log"
	"time"
)

// AuthToken represents an authentication token entry in the database
type AuthToken struct {
	Token      string
	Username   string
	ClientID   string
	Expiration time.Time
}

// CreateAuthToken creates a new auth token for a given user and adds it to the database
func CreateAuthToken(tx *sql.Tx, tokenString string, username string, clientID string, expiration time.Time) (*AuthToken, error) {
	token := AuthToken{
		Token:      tokenString,
		Username:   username,
		ClientID:   clientID,
		Expiration: expiration,
	}

	_, err := tx.Exec(`
    INSERT INTO auth_tokens (token, username, client_id, expires_on)
      VALUES ($1, $2, $3, $4);
  `, token.Token,
		token.Username,
		token.ClientID,
		token.Expiration)

	return &token, err
}

// GetAuthToken retrieves a single auth token
func GetAuthToken(tx *sql.Tx, tokenString string, allowExpired bool) (*AuthToken, error) {
	var row *sql.Row
	if allowExpired {
		row = tx.QueryRow(`
      SELECT token, username, client_id, expires_on
        FROM auth_tokens
        WHERE token=$1;
    `, tokenString)
	} else {
		row = tx.QueryRow(`
      SELECT token, username, client_id, expires_on
        FROM auth_tokens
        WHERE token=$1 AND expires_on > $2;
    `, tokenString, time.Now())
	}

	var token AuthToken
	err := row.Scan(
		&token.Token,
		&token.Username,
		&token.ClientID,
		&token.Expiration,
	)

	if err != nil {
		return nil, err
	}
	return &token, nil
}

// GetValidAuthTokensForUser returns all valid tokens for a given user
func GetValidAuthTokensForUser(tx *sql.Tx, username string) ([]AuthToken, error) {
	rows, err := tx.Query(`SELECT token, username, client_id, expires_on
    FROM auth_tokens
    WHERE username=$1 AND expires_on>$2;
  `, username, time.Now())

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	tokens := []AuthToken{}
	for rows.Next() {
		var token AuthToken
		err = rows.Scan(
			&token.Token,
			&token.Username,
			&token.ClientID,
			&token.Expiration,
		)
		if err != nil {
			return nil, err
		}
		tokens = append(tokens, token)
	}
	log.Println(tokens)
	return tokens, nil
}

// Expire expires this token (logs out) and sets its expiration to now in-place
func (t *AuthToken) Expire(tx *sql.Tx) error {
	t.Expiration = time.Now()
	_, err := tx.Exec(`
    UPDATE auth_tokens
      SET expires_on=$1
      WHERE token=$2;
  `, t.Expiration, t.Token)

	return err
}
