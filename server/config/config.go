package config

import (
	"auth-service/internal/utils"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port      string
	DbURI     string
	DBName    string
	JwtSecret string
}

func LoadConfig() *Config {
	if err := godotenv.Load(); err != nil {
		utils.Logger.Warn("Warning: .env file not found, relying on environment variables")
	}

	return &Config{
		Port:      getEnv("PORT", "8080"),
		DbURI:     getEnv("MONGO_URI", "mongodb://localhost:27017"),
		DBName:    getEnv("DB_NAME", "myDB"),
		JwtSecret: getEnv("JWT_SECRET", "your_secret_key"),
	}
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		utils.Logger.WithField("key", key).WithField("default", defaultValue).Warn("Environment variable not set, using default")
		return defaultValue
	}
	return value
}
