package db

import (
	"database/sql"
	"log"

	_ "github.com/fsufitch/gw2slots/server/db/migration" // Migrations for goose
	_ "github.com/lib/pq"                                // Import PostgreSQL driver
	"github.com/pressly/goose"
)

// ConnectionFactory is a cache struct for providing DB connections
type ConnectionFactory struct {
	cachedConnections map[string]*sql.DB
}

// DBFactory is the default global DB connection cache
var DBFactory = ConnectionFactory{map[string]*sql.DB{}}

// GetPQConnection opens or retrieves a connection to a PostgreSQL database
func (f *ConnectionFactory) GetPQConnection(dbURL string) *sql.DB {
	if _, ok := f.cachedConnections[dbURL]; !ok {
		conn, err := sql.Open("postgres", dbURL)
		if err != nil {
			log.Printf("[ERROR] Failed connecting to db: %v", err)
		} else {
			f.cachedConnections[dbURL] = conn
		}
	}
	return f.cachedConnections[dbURL]
}

// GenerateTx returns a blocking channel of fresh transactions
func (f *ConnectionFactory) GenerateTx(dbURL string) <-chan *sql.Tx {
	txChan := make(chan *sql.Tx)
	go func() {
		for {
			tx, err := f.GetPQConnection(dbURL).Begin()
			if err != nil {
				log.Printf("[ERROR] Failed starting db transaction: %v", err)
			} else {
				txChan <- tx
			}
		}
	}()
	return txChan
}

// RunMigrations attempts to run database migrations on the given database
func RunMigrations(db *sql.DB) (err error) {
	log.Println("Running database migrations...")
	err = goose.SetDialect("postgres")
	if err != nil {
		return
	}

	err = goose.Run("up", db, "")
	return
}
