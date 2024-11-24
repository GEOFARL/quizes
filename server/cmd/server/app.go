package main

import (
	"auth-service/config"
	"auth-service/internal/app"
	"auth-service/internal/utils"
	"log"
)

func main() {
	cfg := config.LoadConfig()
	db := utils.ConnectDB(cfg.DbURI)
	app := app.InitializeApp(cfg, db)

	log.Printf("Server running on port %s", cfg.Port)
	log.Fatal(app.Router.Run(":" + cfg.Port))
}
