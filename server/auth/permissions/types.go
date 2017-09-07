package permissions

import (
	"net/http"

	"github.com/fsufitch/gw2slots/server/db"
)

// AllowFunc is a callback function that applies permissions on a user/request
type AllowFunc func(db.User, *http.Request) bool
