package middleware

import (
	"auth-service/config"
	"auth-service/internal/utils"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func LoadCORS(router *gin.Engine, cfg *config.Config) {
	utils.Logger.WithField("client", cfg.ClientURL).Info("Loading CORS middleware")
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{cfg.ClientURL},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))
}
