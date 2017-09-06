package gw2slots

import (
	"fmt"
	"log"
	"os"

	"github.com/fsufitch/gw2slots/server/db"
	"github.com/fsufitch/gw2slots/server/gw2api"
	"gopkg.in/urfave/cli.v1"
)

func runMigrations(c *cli.Context) error {
	env, err := getEnvironment()
	if err != nil {
		log.Fatal(err)
	}

	conn := db.DBFactory.GetPQConnection(env.DatabaseURL)
	err = db.RunMigrations(conn)
	if err != nil {
		log.Fatal(err)
	}
	return err
}

// RunCommand runs the command line interface for gw2slots
func RunCommand() {
	app := cli.NewApp()
	app.Name = "gw2slots"
	app.Usage = "command line interface to gw2slots server and utilities"
	app.Commands = []cli.Command{
		{
			Name:      "serve",
			Usage:     "start the gw2slots web server",
			ArgsUsage: "STATIC_DIR",
			Action: func(c *cli.Context) error {
				staticDir := c.Args().First()
				server, err := newWebServer(staticDir)
				if err != nil {
					log.Fatal(err)
				}

				err = runMigrations(nil)
				if err != nil {
					log.Fatal(err)
				}
				log.Fatal(server.Start())
				return nil
			},
		},

		{
			Name:   "migrate",
			Usage:  "run all available migrations",
			Action: runMigrations,
		},

		{
			Name:  "script",
			Usage: "sample \"command\" for manual functionality testing",
			Action: func(c *cli.Context) error {
				api := gw2api.GW2API{
					BaseURL: gw2api.MainGW2BaseURL,
					Key:     "abc",
				}

				files, err := api.Files().GetAllFiles()
				fmt.Println(files)
				fmt.Println(err)

				return nil
			},
		},
	}

	app.Run(os.Args)
}
