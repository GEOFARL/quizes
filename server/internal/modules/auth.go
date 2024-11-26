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
	handler *handlers.AuthHandler
}

func NewAuthModule(ctx *context.Context) *AuthModule {
	return &AuthModule{
		context: ctx,
		handler: nil,
	}
}
func (m *AuthModule) Init() error {
	userRepo, err := repository.NewUserRepository("mongo", m.context.DB, m.context.Config.DBName, m.context.Config.Collections.Users)
	if err != nil {
		utils.Logger.WithError(err).Error("Failed to initialize UserRepository")
		return err
	}
	authService := services.NewAuthService(userRepo, m.context.Config.JwtSecret)
	m.handler = handlers.NewAuthHandler(authService)
	return nil
}

func (m *AuthModule) RegisterRoutes(router *gin.Engine) {
	routes.RegisterAuthRoutes(router, m.handler, m.context)
}
