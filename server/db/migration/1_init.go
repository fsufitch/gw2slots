package migration

import (
	"database/sql"

	"github.com/pressly/goose"
)

func init() {
	goose.AddMigration(Up1, Down1)
}

// Up1 updates the database to the new requirements
func Up1(tx *sql.Tx) error {
	return nil
}

// Down1 should send the database back to the state it was from before Up was ran
func Down1(tx *sql.Tx) error {
	return nil
}
