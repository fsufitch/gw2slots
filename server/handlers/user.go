package handlers

import (
	"database/sql"
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/fsufitch/gw2slots/server/auth"
	"github.com/fsufitch/gw2slots/server/db"
	"github.com/fsufitch/gw2slots/server/gw2api"
	"github.com/gorilla/mux"
)

type createUserInput struct {
	Username string `json:"username"`
	Password string `json:"password"`
	APIKey   string `json:"api_key"`
}

type userOutput struct {
	Username    string              `json:"username"`
	CreatedOn   int64               `json:"created_on_unix_sec"`
	Balance     int                 `json:"balance"`
	APIKey      string              `json:"api_key"`
	GameName    string              `json:"game_name"`
	Permissions *db.UserPermissions `json:"permissions"`
}

func userOutputFromUser(user *db.User) userOutput {
	return userOutput{
		Username:    user.Username,
		CreatedOn:   user.CreatedOn.Unix(),
		Balance:     user.Balance,
		APIKey:      user.APIKey,
		GameName:    user.GameName,
		Permissions: user.Permissions,
	}
}

// === Create User Handler

type createUserHandler struct {
	txGen <-chan *sql.Tx
}

func (h createUserHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if HSTSRedirect(w, r) {
		return
	}

	tx := <-h.txGen
	defer tx.Rollback()

	body, _ := ioutil.ReadAll(r.Body)
	var userInput createUserInput
	err := json.Unmarshal(body, &userInput)
	if err != nil {
		writeClientError(w, http.StatusBadRequest, "Could not parse request body: "+err.Error())
		return
	}

	existingUser, _ := db.GetUser(tx, userInput.Username)
	if existingUser != nil {
		writeClientError(w, http.StatusConflict, "duplicate username")
		return
	}

	accountData, err := gw2api.DefaultAPI().WithKey(userInput.APIKey).Account().Get()
	if err != nil {
		writeClientError(w, http.StatusForbidden, "error validating API key: "+err.Error())
		return
	}

	if accountData.Access == "FreeToPlay" {
		writeClientError(w, http.StatusForbidden, "free to play not allowed")
		return
	}

	gameName := accountData.Name

	if db.UserGameNameExists(tx, gameName) {
		writeClientError(w, http.StatusConflict, "duplicate gamename")
		return
	}

	salt, _ := auth.GenerateSalt()
	passHash := auth.SecureHash(userInput.Password, salt)

	newUser, err := db.CreateUser(tx, userInput.Username, passHash, salt, gameName)
	if err != nil {
		writeServerError(w, http.StatusInternalServerError, err.Error())
		return
	}
	tx.Commit()

	output := userOutputFromUser(newUser)
	outData, _ := json.Marshal(output)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(outData)
}

// === Get User Handler

type getUserHandler struct {
	txGen <-chan *sql.Tx
}

func (h getUserHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if HSTSRedirect(w, r) {
		return
	}

	tx := <-h.txGen
	defer tx.Rollback()

	username := mux.Vars(r)["username"]
	user, err := db.GetUser(tx, username)
	if err == sql.ErrNoRows {
		writeClientError(w, http.StatusNotFound, "user not found")
		return
	} else if err != nil {
		writeServerError(w, http.StatusInternalServerError, err.Error())
		return
	}

	output := userOutputFromUser(user)
	outData, _ := json.Marshal(output)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(outData)
}
