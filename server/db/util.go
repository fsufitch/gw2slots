package db

import (
	"encoding/base64"
	"encoding/json"
	"log"
)

func encodeBase64(data []byte) string {
	return base64.StdEncoding.EncodeToString(data)
}

func decodeBase64(data string) ([]byte, error) {
	return base64.StdEncoding.DecodeString(data)
}

func encodeJSONFailsafe(data interface{}) string {
	output, err := json.Marshal(data)
	if err != nil {
		log.Printf("ERROR encoding JSON: %v", err)
		return "{}"
	}
	return string(output)
}
