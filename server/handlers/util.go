package handlers

import (
	"net/http"
	"net/url"
)

func writeClientError(w http.ResponseWriter, statusCode int, text string) {
	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(statusCode)
	w.Write([]byte("client error: " + text))
}

func writeServerError(w http.ResponseWriter, statusCode int, text string) {
	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(statusCode)
	w.Write([]byte("server error: " + text))
}

// HerokuSSLRedirectHost holds the host where HTTPS redirection should go to
var HerokuSSLRedirectHost = ""

// ProdHerokuSSLRedirect redirects to using SSL, if configured to do so, and returns whether it did so
func ProdHerokuSSLRedirect(w http.ResponseWriter, r *http.Request) bool {
	if HerokuSSLRedirectHost == "" {
		return false
	}

	if r.Header.Get("X-Forwarded-Proto") == "http" {
		url, _ := url.Parse(r.URL.String())

		url.Scheme = "https"
		url.Host = HerokuSSLRedirectHost

		w.Header().Set("Location", url.String())
		w.WriteHeader(301)
		w.Write([]byte(""))
		return true
	}

	return false
}
