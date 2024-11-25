package main

import (
	"auth-service/config"
	"auth-service/internal/app"
	"auth-service/internal/utils"
)

func main() {
	cfg := config.LoadConfig()
	utils.InitializeLogger()
	db := utils.ConnectDB(cfg.DbURI)
	app := app.InitializeApp(cfg, db)
	app.Run()
}
