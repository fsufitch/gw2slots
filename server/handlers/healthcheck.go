package handlers

import (
	"database/sql"
	"net/http"
)

type healthCheckHandler struct {
	TxGenerator <-chan *sql.Tx
}

func (h healthCheckHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if HSTSRedirect(w, r) {
		return
	}

	tx := <-h.TxGenerator
	tx.Rollback()

	w.Write([]byte("OK"))
}
