package handlers

import (
	"database/sql"
	"net/http"

	"github.com/fsufitch/gw2slots/server/db"
	"github.com/gorilla/mux"
)

// RegisterHandlers registers all the handlers at appropriate routes
func RegisterHandlers(router *mux.Router, txGen <-chan *sql.Tx) {
	// Public endpoints
	router.Path("/auth/login").Methods("GET").Handler(loginHandler{txGen})
	router.Path("/user").Methods("POST").Handler(createUserHandler{txGen})

	// Protected endpoints, require login
	router.Path("/user/{username}").Methods("GET").Handler(SecureHandler{
		txGen:          txGen,
		wrappedHandler: getUserHandler{txGen},
		allowFunc: func(u db.User, r *http.Request) bool {
			return u.Permissions.Admin || u.Username == mux.Vars(r)["username"]
		},
	})

}
