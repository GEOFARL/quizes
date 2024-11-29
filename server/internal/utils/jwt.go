package utils

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateJWT(user map[string]interface{}, secret string) (string, error) {
	delete(user, "password")
	claims := jwt.MapClaims{
		"user": user,
		"exp":  time.Now().Add(24 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(secret))
	if err != nil {
		Logger.WithError(err).Error("Failed to sign JWT")
		return "", err
	}
	Logger.WithField("user", user).WithField("token", signedToken).Info("JWT generated successfully")
	return signedToken, nil
}

func ValidateJWT(tokenString string, secret string) (map[string]interface{}, error) {
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
		Logger.WithField("user", claims["user"]).Info("JWT validated successfully")
		return claims, nil
	}

	Logger.Warn("Invalid JWT token")
	return nil, fmt.Errorf("invalid token")
}
