package gw2api

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

// Account returns a sub-API for v2 `account` endpoints
func (a GW2API) Account() Account {
	return Account{a}
}

// Account is an object encapsulating v2 `account` endpoints
type Account struct {
	API GW2API
}

// AccountGetResponse contains data retrieved about an account
type AccountGetResponse struct {
	ID     string   `json:"id"`
	Name   string   `json:"name"`
	Access []string `json:"access"` // [PlayForFree | GuildWars2 | HeartOfThorns]
	// More fields omitted for simplicity. https://wiki.guildwars2.com/wiki/API:2/account
}

// Get retrieves basic account information
func (a Account) Get() (*AccountGetResponse, error) {
	url := a.API.BaseURL
	url.Path = "/v2/account"

	q := url.Query()
	q.Set("access_token", a.API.Key)
	url.RawQuery = q.Encode()

	resp, err := http.Get(url.String())
	if err != nil {
		return nil, err
	}

	if resp.StatusCode == http.StatusForbidden {
		return nil, ErrBadKey
	}

	if resp.StatusCode != 200 {
		log.Printf("[ERROR] API failed: %v", resp)
		return nil, fmt.Errorf("Unknown API failure: %v", resp.Status)
	}

	bodyData, _ := ioutil.ReadAll(resp.Body)
	var parsedResponse AccountGetResponse
	err = json.Unmarshal(bodyData, &parsedResponse)

	return &parsedResponse, err
}
