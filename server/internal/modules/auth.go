package modules

import (
	"auth-service/internal/handlers"
	repository "auth-service/internal/repositories/user"
	"auth-service/internal/routes"
	"auth-service/internal/services"
	"auth-service/internal/utils"

	"github.com/gin-gonic/gin"
)

type AuthModule struct {
	context *context
}

func NewAuthModule(ctx *context) *AuthModule {
	return &AuthModule{
		context: ctx,
	}
}

func (m *AuthModule) Init(router *gin.Engine) error {
	userRepo, err := repository.NewUserRepository("mongo", m.context.db, m.context.config.DBName, m.context.config.Collections.Users)
	if err != nil {
		utils.Logger.WithError(err).Error("Failed to initialize UserRepository")
		return err
	}

	authService := services.NewAuthService(userRepo, m.context.config.JwtSecret)
	authHandler := handlers.NewAuthHandler(authService)
	routes.RegisterAuthRoutes(router, authHandler, m.context.config.JwtSecret)

	utils.Logger.Info("Auth module initialized successfully")
	return nil
}
