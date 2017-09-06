package db

import (
	"database/sql"
	"encoding/json"
	"time"
)

// User represents a user row in the database
type User struct {
	Username     string
	PasswordHash []byte
	PasswordSalt []byte
	CreatedOn    time.Time
	Balance      int
	APIKey       string
	GameName     string
	Permissions  *UserPermissions
}

// UserPermissions encapsulates a user's special permissions
// It should be JSON-serializable for easy storage
type UserPermissions struct {
	Admin bool `json:"admin"`
}

// CreateUser creates a new User in the database
func CreateUser(tx *sql.Tx, username string, passHash []byte, passSalt []byte, gameName string) (*User, error) {
	user := &User{
		Username:     username,
		PasswordHash: passHash,
		PasswordSalt: passSalt,
		CreatedOn:    time.Now(),
		Balance:      0,
		APIKey:       "",
		GameName:     gameName,
		Permissions:  &UserPermissions{},
	}

	_, err := tx.Exec(`
    INSERT INTO users (username, pass_hash, pass_salt, created_on, balance, api_key, gw2_name, permissions_json)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
  `, user.Username,
		encodeBase64(user.PasswordHash),
		encodeBase64(user.PasswordSalt),
		user.CreatedOn,
		user.Balance,
		user.APIKey,
		user.GameName,
		encodeJSONFailsafe(user.Permissions))

	if err != nil {
		return nil, err
	}

	return user, nil
}

// GetUser retrieves a User from the database
func GetUser(tx *sql.Tx, username string) (*User, error) {
	row := tx.QueryRow(`
    SELECT username, pass_hash, pass_salt, created_on, balance, api_key, gw2_name, permissions_json
      FROM users u
      WHERE u.username=$1;
  `, username)

	user := &User{}
	var passHashEncoded string
	var passSaltEncoded string
	var permissionsJSON string

	err := row.Scan(
		&user.Username,
		&passHashEncoded,
		&passSaltEncoded,
		&user.CreatedOn,
		&user.Balance,
		&user.APIKey,
		&user.GameName,
		&permissionsJSON,
	)
	if err != nil {
		return nil, err
	}

	user.PasswordHash, err = decodeBase64(passHashEncoded)
	if err != nil {
		return nil, err
	}

	user.PasswordSalt, err = decodeBase64(passSaltEncoded)
	if err != nil {
		return nil, err
	}

	err = json.Unmarshal([]byte(permissionsJSON), &user.Permissions)
	return user, err
}

// UserGameNameExists returns whether an user for the given game name already exists
func UserGameNameExists(tx *sql.Tx, gameName string) bool {
	row := tx.QueryRow(`
    SELECT COUNT(*)
      FROM users u
      WHERE u.gw2_name=$1;
  `, gameName)

	var count int
	row.Scan(&count)
	return count > 0
}

// Save updates the entry of this user in the database
func (u User) Save(tx *sql.Tx) error {
	return nil
}
