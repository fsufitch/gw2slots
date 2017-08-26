package resources

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"path"
)

const indexFileName = "index.html"

// GetFallbackHandler returns a fallback handler for the given static path
func GetFallbackHandler(staticPath string) (http.Handler, error) {
	log.Printf("Creating fallback handler %s", path.Join(staticPath, indexFileName))
	data, err := ioutil.ReadFile(path.Join(staticPath, indexFileName))
	if err != nil {
		return nil, fmt.Errorf("Error reading fallback index file %s: %v", indexFileName, err)
	}

	return newStaticHandler(data), nil
}
