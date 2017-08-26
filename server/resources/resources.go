package resources

import (
	"crypto/md5"
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"path"
	"strings"

	"github.com/NYTimes/gziphandler"
	"github.com/gorilla/mux"
)

// RegisterResourcePaths registers paths for static resources
func RegisterResourcePaths(router *mux.Router, staticResourceDir string) error {
	paths, err := getStaticFiles(staticResourceDir)
	if err != nil {
		return err
	}

	for _, path := range paths {
		registerStaticFile(router, path, staticResourceDir)
	}

	return nil
}

func getStaticFiles(basePath string) ([]string, error) {
	fds, err := ioutil.ReadDir(basePath)
	if err != nil {
		return nil, fmt.Errorf("error listing static files: %v", err)
	}
	files := []string{}
	for _, fd := range fds {
		if fd.IsDir() {
			continue // TODO: implement recursive static files?
		}
		files = append(files, fd.Name())
	}
	return files, nil
}

func registerStaticFile(router *mux.Router, fileName string, basePath string) error {
	staticData, err := ioutil.ReadFile(path.Join(basePath, fileName))
	if err != nil {
		return fmt.Errorf("error reading static file %s: %v", fileName, err)
	}
	h := newStaticHandler(staticData)
	log.Printf("Registering static file: %s", fileName)
	router.Handle("/"+fileName, gziphandler.GzipHandler(h))
	return nil
}

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
