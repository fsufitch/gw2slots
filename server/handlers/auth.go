package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/fsufitch/gw2slots/server/auth"
	"github.com/fsufitch/gw2slots/server/db"
)

// loginHandler handles creating a new session, ingesting basic authentication
type loginHandler struct {
	txGen <-chan *sql.Tx
}

type loginResponseJSON struct {
	AuthToken  string `json:"auth_token"`
	Expiration int64  `json:"expires_on_unix_sec"`
}

func (h loginHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	username, password, ok := r.BasicAuth()
	if !ok {
		w.Header().Set("WWW-Authenticate", `Basic realm="gw2slots login"`)
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte{})
		return
	}

	tx := <-h.txGen
	defer tx.Rollback()

	user, err := auth.ValidateCredentials(tx, username, password)
	if err == auth.ErrWrongPassword || user == nil {
		writeClientError(w, http.StatusForbidden, "wrong username/password")
		return
	} else if err != nil {
		writeServerError(w, http.StatusInternalServerError, err.Error())
		return
	}

	clientID := auth.GetClientID(r)
	token, err := auth.GetOrCreateAuthToken(tx, user.Username, clientID)
	if err != nil {
		writeServerError(w, http.StatusInternalServerError, err.Error())
		return
	}
	tx.Commit()

	response := loginResponseJSON{token.Token, token.Expiration.Unix()}
	data, _ := json.Marshal(response)
	w.Header().Set("Content-type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

// ===

type logoutHandler struct {
	txGen <-chan *sql.Tx
}

func (h logoutHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	tx := <-h.txGen
	defer tx.Rollback()

	user, err := auth.UserForRequest(tx, r)
	if _, ok := err.(auth.AuthorizationFailedError); ok {
		writeClientError(w, http.StatusForbidden, "you are not logged in")
		return
	}
	if err != nil {
		writeServerError(w, http.StatusInternalServerError, err.Error())
		return
	}

	tokens, err := db.GetValidAuthTokensForUser(tx, user.Username)
	if err != nil {
		writeServerError(w, http.StatusInternalServerError, err.Error())
		return
	}

	for _, token := range tokens {
		token.Expire(tx)
	}
	if len(tokens) > 0 {
		tx.Commit()
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}
