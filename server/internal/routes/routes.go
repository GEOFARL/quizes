package routes

import (
	"auth-service/internal/handlers"
	"auth-service/internal/middleware"
	"auth-service/internal/services"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine, authService *services.AuthService, jwtSecret string) {
	authHandler := handlers.NewAuthHandler(authService)

	router.POST("/register", authHandler.Register)
	router.POST("/login", authHandler.Login)

	protected := router.Group("/protected")
	protected.Use(middleware.ValidateJWT(jwtSecret))
	protected.GET("/profile", authHandler.Profile)
}
