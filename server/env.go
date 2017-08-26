package gw2slots

import "os"

type errMissingEnvironmentVariable string

func (e errMissingEnvironmentVariable) Error() string {
	return "gw2slots(env): missing environment variable " + string(e)
}

type environment struct {
	APIHost   string
	ServePort string
}

func getEnvironment() (*environment, error) {
	env := &environment{}

	requiredVarsDestinations := map[string]*string{
		"GW2SLOTS_API_HOST": &env.APIHost,
		"PORT":              &env.ServePort,
	}

	for varName, dest := range requiredVarsDestinations {
		value, err := requireEnvVar(varName)
		if err != nil {
			return nil, err
		}
		*dest = value
	}

	return env, nil
}

func requireEnvVar(varName string) (string, *errMissingEnvironmentVariable) {
	value := os.Getenv(varName)
	if value == "" {
		err := errMissingEnvironmentVariable(varName)
		return "", &err
	}
	return value, nil
}
