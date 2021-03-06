package gw2slots

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/fsufitch/gw2slots/server/db"
	"github.com/fsufitch/gw2slots/server/handlers"
	"github.com/fsufitch/gw2slots/server/resources"
	"github.com/gorilla/mux"
)

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

	router, err := s.createRoutes()
	if err != nil {
		return err
	}

	srv := &http.Server{
		Handler: router,
		Addr:    ":" + s.Environment.ServePort,
	}

	if s.Environment.SSLRedirectHost != "" {
		log.Printf("Enabling prod SSL redirection, host: %s", s.Environment.SSLRedirectHost)
		handlers.HerokuSSLRedirectHost = s.Environment.SSLRedirectHost
	}

	log.Printf("Serving on port %v", s.Environment.ServePort)
	return srv.ListenAndServe()
}

func (s webServer) createRoutes() (*mux.Router, error) {
	router := mux.NewRouter()
	txChan := db.DBFactory.GenerateTx(s.Environment.DatabaseURL)

	err := resources.RegisterResourcePaths(router, s.StaticDir)
	if err != nil {
		return nil, err
	}

	fallbackHandler, err := resources.GetFallbackHandler(s.StaticDir, s.Environment.APIHost)
	if err != nil {
		return nil, err
	}

	handlers.RegisterHandlers(router, txChan)

	router.PathPrefix("/").Methods("GET").Handler(fallbackHandler)

	return router, nil
}
