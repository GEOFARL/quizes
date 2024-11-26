package modules

import (
	"auth-service/internal/context"
	"auth-service/internal/handlers"
	repository "auth-service/internal/repositories/user"
	"auth-service/internal/routes"
	"auth-service/internal/services"
	"auth-service/internal/utils"

	"github.com/gin-gonic/gin"
)

type AuthModule struct {
	context *context.Context
}

func NewAuthModule(ctx *context.Context) *AuthModule {
	return &AuthModule{
		context: ctx,
	}
}

func (m *AuthModule) Init(router *gin.Engine) error {
	userRepo, err := repository.NewUserRepository("mongo", m.context.DB, m.context.Config.DBName, m.context.Config.Collections.Users)
	if err != nil {
		utils.Logger.WithError(err).Error("Failed to initialize UserRepository")
		return err
	}

	authService := services.NewAuthService(userRepo, m.context.Config.JwtSecret)
	authHandler := handlers.NewAuthHandler(authService)
	routes.RegisterAuthRoutes(router, authHandler, m.context.Config.JwtSecret)
	utils.Logger.Info("Auth module initialized successfully")
	return nil
}
