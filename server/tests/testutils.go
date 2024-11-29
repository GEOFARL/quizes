package tests

import (
	"auth-service/config"
	"auth-service/internal/context"
	"auth-service/internal/utils"
)

func NewTestContext() *context.Context {
	cfg := &config.Config{
		Port:        "8080",
		DBURI:       "mongodb://localhost:27017/",
		DBName:      "testdb",
		JwtSecret:   "test_secret",
		Collections: config.NewCollections(),
		Routes:      config.NewRouteRegistry(),
		ClientURL:   "http://localhost:3000",
		OpenAIKey:   "",
		Environment: "development",
	}
	utils.InitializeLogger()
	db := utils.ConnectDB(cfg.DBURI)
	return &context.Context{
		Config: cfg,
		DB:     db,
	}
}
