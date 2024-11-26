package routes

import (
	"auth-service/internal/handlers"
	"auth-service/internal/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterAuthRoutes(router *gin.Engine, authHandler *handlers.AuthHandler, jwtSecret string) {
	router.POST("/register", authHandler.Register)
	router.POST("/login", authHandler.Login)

	protected := router.Group("/protected")
	protected.Use(middleware.ValidateJWT(jwtSecret))
	protected.GET("/profile", authHandler.Profile)
}
