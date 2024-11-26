package tests

import (
	"auth-service/config"
	"auth-service/internal/app"
	"auth-service/internal/utils"

	"go.mongodb.org/mongo-driver/mongo"
)

func CreateTestServer() (*app.App, *mongo.Client) {
	cfg := &config.Config{
		Port:        "8080",
		DbURI:       "mongodb://localhost:27017/",
		DBName:      "testdb",
		JwtSecret:   "test_secret",
		Collections: config.NewCollections(),
	}

	utils.InitializeLogger()

	db := utils.ConnectDB(cfg.DbURI)

	return app.InitializeApp(cfg, db), db
}
