package gw2api

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
)

// Files returns a sub-API for v2 `files` endpoints
func (a GW2API) Files() Files {
	return Files{a}
}

// Files is an object encapsulating v2 `files` endpoints
type Files struct {
	API GW2API
}

type fileResponse struct {
	ID   string `json:"id"`
	Icon string `json:"icon"`
}

// GetAllFiles retrieves all file URLs provided by the API
func (f Files) GetAllFiles() (map[string]string, error) {
	return f.GetFiles("all")
}

// GetFiles queries /v2/files?ids=...
func (f Files) GetFiles(ids ...string) (map[string]string, error) {
	url := f.API.BaseURL
	url.Path = "/v2/files"

	q := url.Query()
	q.Set("ids", strings.Join(ids, ","))
	url.RawQuery = q.Encode()

	resp, err := http.Get(url.String())
	if err != nil {
		return nil, err
	}

	body, _ := ioutil.ReadAll(resp.Body)
	fileData := []fileResponse{}
	err = json.Unmarshal(body, &fileData)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != 200 {
		log.Printf("[ERROR] API failed: %v", resp)
		return nil, fmt.Errorf("Unknown API failure: %v", resp.Status)
	}

	fileMap := map[string]string{}
	for _, file := range fileData {
		fileMap[file.ID] = file.Icon
	}

	return fileMap, nil
}
