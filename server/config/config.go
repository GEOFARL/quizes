package config

import (
	"auth-service/internal/utils"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	DBURI       string
	DBName      string
	JwtSecret   string
	ClientURL   string
	OpenAIKey   string
	Environment string
	Collections *Collections
	Routes      *RouteRegistry
}

func LoadConfig() *Config {
	if err := godotenv.Load(); err != nil {
		utils.Logger.Warn("Warning: .env file not found, relying on environment variables")
	}

	return &Config{
		Port:        getEnv("PORT", "8080"),
		DBURI:       getEnv("MONGO_URI", "mongodb://localhost:27017"),
		DBName:      getEnv("DB_NAME", "myDB"),
		JwtSecret:   getEnv("JWT_SECRET", "your_secret_key"),
		ClientURL:   getEnv("CLIENT_URL", "http://localhost:3000"),
		OpenAIKey:   getEnv("OPENAI_API_KEY", ""),
		Environment: getEnv("ENVIRONMENT", "development"),
		Collections: NewCollections(),
		Routes:      NewRouteRegistry(),
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
