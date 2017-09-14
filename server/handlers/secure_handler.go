package handlers

import (
	"database/sql"
	"net/http"

	"github.com/fsufitch/gw2slots/server/auth"
)

// SecureHandler is a HTTP handler wrapper for applying permissions restrictions
type SecureHandler struct {
	txGen          <-chan *sql.Tx
	wrappedHandler http.Handler
	allowFunc      auth.AllowFunc
}

func (h SecureHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if ProdHerokuSSLRedirect(w, r) {
		return
	}

	tx := <-h.txGen
	defer tx.Rollback()

	user, err := auth.UserForRequest(tx, r)
	if err != nil {
		writeClientError(w, http.StatusForbidden, "authorization failed")
		return
	}
	if user == nil {
		writeServerError(w, http.StatusInternalServerError, "no user found, but no error")
		return
	}

	if !h.allowFunc(*user, r) {
		writeClientError(w, http.StatusForbidden, "you are not allowed to do that")
		return
	}

	h.wrappedHandler.ServeHTTP(w, r)
}
