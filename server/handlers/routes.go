package handlers

import (
	"database/sql"

	"github.com/gorilla/mux"
)

// RegisterHandlers registers all the handlers at appropriate routes
func RegisterHandlers(router *mux.Router, txGen <-chan *sql.Tx) {
	router.Path("/auth/login").Methods("GET").Handler(loginHandler{txGen})
	router.Path("/user").Methods("POST").Handler(createUserHandler{txGen})
	router.Path("/user/{username}").Methods("GET").Handler(getUserHandler{txGen})
}
