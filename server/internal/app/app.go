package app

import (
	"auth-service/config"
	"auth-service/internal/repositories"
	"auth-service/internal/routes"
	"auth-service/internal/services"
	"log"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

type App struct {
	Config      *config.Config
	Router      *gin.Engine
	AuthService *services.AuthService
}

func InitializeApp(cfg *config.Config, db *mongo.Client) *App {
	userRepo := repositories.NewUserRepository(db, cfg.DBName)
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
	log.Printf("Server running on port %s", app.Config.Port)
	log.Fatal(app.Router.Run(":" + app.Config.Port))
}
