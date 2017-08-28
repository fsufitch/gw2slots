package gw2slots

import (
	"fmt"
	"log"
	"os"

	"github.com/fsufitch/gw2slots/server/gw2api"
	"gopkg.in/urfave/cli.v1"
)

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
					fmt.Fprintln(os.Stderr, err.Error())
					return err
				}

				log.Fatal(server.Start())
				return nil
			},
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
