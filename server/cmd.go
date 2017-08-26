package gw2slots

import (
	"fmt"
	"log"
	"os"

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
	}

	app.Run(os.Args)
}
