package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/fsufitch/gw2slots/server/auth"
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
