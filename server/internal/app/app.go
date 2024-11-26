package app

import (
	"auth-service/config"
	repository "auth-service/internal/repositories/user"
	"auth-service/internal/routes"
	"auth-service/internal/services"
	"auth-service/internal/utils"
	"os"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

type App struct {
	Config      *config.Config
	Router      *gin.Engine
	AuthService *services.AuthService
}

func InitializeApp(cfg *config.Config, db *mongo.Client) *App {
	userRepo, err := repository.NewUserRepository("mongo", db, cfg.DBName, cfg.Collections.Users)
	if err != nil {
		utils.Logger.WithError(err).Error("Failed to initialize user repository")
		os.Exit(1)
	}
	authService := services.NewAuthService(userRepo, cfg.JwtSecret)

	router := gin.Default()

	routes.RegisterRoutes(router, authService, cfg.JwtSecret)

	return &App{
		Config:      cfg,
		Router:      router,
		AuthService: authService,
	}
}

func (app *App) Run() {
	utils.Logger.WithField("port", app.Config.Port).Info("Server running")
	if err := app.Router.Run(":" + app.Config.Port); err != nil {
		utils.Logger.WithError(err).Error("Failed to start the server")
		os.Exit(1)
	}
}
