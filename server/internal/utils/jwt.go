package utils

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateJWT(username, secret string) (string, error) {
	claims := jwt.MapClaims{
		"username": username,
		"exp":      time.Now().Add(time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(secret))
	if err != nil {
		Logger.WithError(err).Error("Failed to sign JWT")
		return "", err
	}
	Logger.WithField("username", username).Info("JWT generated successfully")
	return signedToken, nil
}

func ValidateJWT(tokenString string, secret string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			Logger.Error("Unexpected signing method")
			return nil, fmt.Errorf("unexpected signing method")
		}
		return []byte(secret), nil
	})
	if err != nil {
		Logger.WithError(err).Warn("Failed to parse JWT")
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		Logger.WithField("username", claims["username"]).Info("JWT validated successfully")
		return claims, nil
	}

	Logger.Warn("Invalid JWT token")
	return nil, fmt.Errorf("invalid token")
}
