package gw2slots

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/NYTimes/gziphandler"
	"github.com/gorilla/mux"
)

const staticPath = "static"

type webServer struct {
	StaticDir   string
	Environment *environment
}

func newWebServer(staticDir string) (server *webServer, err error) {
	log.Println("Configuring gw2slots server...")
	if staticDir == "" {
		err = fmt.Errorf("gw2slots(server): static dir location not specified")
		return
	}
	info, err := os.Stat(staticDir)
	if info != nil && !info.IsDir() {
		err = fmt.Errorf("gw2slots(server): static dir `%s` is not a directory", staticDir)
		return
	}
	if err != nil {
		return
	}

	env, err := getEnvironment()
	if err != nil {
		return
	}

	server = &webServer{staticDir, env}
	return
}

func (s webServer) Start() error {
	log.Println("Starting gw2slots server...")

	srv := &http.Server{
		Handler: s.createRoutes(),
		Addr:    ":" + s.Environment.ServePort,
	}

	log.Printf("Serving on port %v", s.Environment.ServePort)
	return srv.ListenAndServe()
}

func (s webServer) createRoutes() *mux.Router {
	router := mux.NewRouter()

	staticPrefix := fmt.Sprintf("/%s/", staticPath)
	staticHandler := gziphandler.GzipHandler(http.StripPrefix(
		staticPrefix,
		http.FileServer(http.Dir(s.StaticDir)),
	))
	router.PathPrefix(staticPrefix).Handler(staticHandler)

	return router
}
