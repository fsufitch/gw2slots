package auth

import (
	cryptoRand "crypto/rand"
	"crypto/sha512"
	"math/rand"
)

// GenerateSalt creates a crytographically secure (?) salt
func GenerateSalt() ([]byte, error) {
	saltLength := 20 + rand.Intn(11) // Salt is 20-30 bytes long
	salt := make([]byte, saltLength)
	_, err := cryptoRand.Read(salt)
	return salt, err
}

// SecureHash creates a secure SHA512 salt based on some text and a salt
func SecureHash(text string, salt []byte) []byte {
	hashSource := []byte{}
	hashSource = append(hashSource, []byte(text)...)
	hashSource = append(hashSource, []byte("++")...)
	hashSource = append(hashSource, salt...)

	return sha512.New().Sum(hashSource)
}
