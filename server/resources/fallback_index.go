package resources

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"path"

	"github.com/fsufitch/gw2slots/server/handlers"
)

const indexFileName = "index.html"

type fallbackHandler struct {
	Wrapped http.Handler
}

func (h fallbackHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if handlers.HSTSRedirect(w, r) {
		return
	}
	h.Wrapped.ServeHTTP(w, r)
}

// GetFallbackHandler returns a fallback handler for the given static path
func GetFallbackHandler(staticPath string) (http.Handler, error) {
	log.Printf("Creating fallback handler %s", path.Join(staticPath, indexFileName))
	data, err := ioutil.ReadFile(path.Join(staticPath, indexFileName))
	if err != nil {
		return nil, fmt.Errorf("Error reading fallback index file %s: %v", indexFileName, err)
	}

	return fallbackHandler{newStaticHandler(data)}, nil
}
