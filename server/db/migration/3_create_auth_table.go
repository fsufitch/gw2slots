package migration

import (
	"database/sql"

	"github.com/pressly/goose"
)

func init() {
	goose.AddMigration(Up3, Down3)
}

// Up3 creates the auth token table
func Up3(tx *sql.Tx) error {
	_, err := tx.Exec(`
    CREATE TABLE auth_tokens (
			token VARCHAR(64) PRIMARY KEY,
			username VARCHAR(64) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
			client_id TEXT,
			expires_on TIMESTAMP
		);

		CREATE INDEX auth_tokens_expires_on_idx
			ON auth_tokens (expires_on);
  `)
	return err
}

// Down3 drops the auth token table
func Down3(tx *sql.Tx) error {
	_, err := tx.Exec(`
		DROP INDEX auth_tokens_expires_on_idx;
		DROP TABLE auth_tokens;
	`)
	return err
}
