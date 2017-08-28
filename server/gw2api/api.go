package gw2api

import "net/url"

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
