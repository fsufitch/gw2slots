package gw2api

import (
	"errors"
	"net/url"
)

const mainGW2RawURL = "https://api.guildwars2.com"

// MainGW2BaseURL contains the base URL to the main GW2 API server
var MainGW2BaseURL url.URL

func init() {
	u, _ := url.Parse(mainGW2RawURL)
	MainGW2BaseURL = *u
}

// GW2API is a type that provides an interface to GW2's API
type GW2API struct {
	BaseURL url.URL
	Key     string
}

// DefaultAPI builds a GW2API using the default base URL and no key
func DefaultAPI() GW2API {
	return GW2API{BaseURL: MainGW2BaseURL}
}

// WithKey is a functional patch on the GW2API to register a key to it
func (a GW2API) WithKey(key string) GW2API {
	a.Key = key
	return a
}

// ErrBadKey is an error for a bad key
var ErrBadKey = errors.New("bad GW2 API key")
