package migration

import (
	"database/sql"

	"github.com/pressly/goose"
)

func init() {
	goose.AddMigration(Up2, Down2)
}

// Up2 creates the user table
func Up2(tx *sql.Tx) error {
	_, err := tx.Exec(`
    CREATE TABLE users (
			username VARCHAR(64) PRIMARY KEY,
			pass_hash TEXT,
			pass_salt TEXT,
			created_on TIMESTAMP,
			balance INTEGER DEFAULT 0,
			api_key TEXT DEFAULT '',
			gw2_name VARCHAR(64) UNIQUE NOT NULL,
			permissions_json TEXT DEFAULT '{}'
		);
  `)
	return err
}

// Down2 drops the user table
func Down2(tx *sql.Tx) error {
	_, err := tx.Exec(`
		DROP TABLE USERS;
	`)
	return err
}
