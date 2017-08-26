package resources

import (
	"crypto/md5"
	"encoding/base64"
	"net/http"
	"strings"
)

type staticHandler struct {
	data []byte
	etag string
}

func newStaticHandler(data []byte) *staticHandler {
	h := staticHandler{}
	h.data = data

	sum := md5.Sum(data)
	h.etag = "\"" + base64.StdEncoding.EncodeToString(sum[:]) + "\""

	return &h
}

func (h staticHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Etag", h.etag)
	w.Header().Set("Cache-Control", "max-age=2592000") // 30 days
	if match := r.Header.Get("If-None-Match"); match != "" {
		if strings.Contains(match, h.etag) {
			w.WriteHeader(http.StatusNotModified)
			return
		}
	}
	w.WriteHeader(http.StatusOK)
	w.Write(h.data)
}
