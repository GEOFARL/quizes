package auth

import (
	"auth-service/internal/context"
	handler "auth-service/internal/handlers/auth"
	repository "auth-service/internal/repositories/user"
	routes "auth-service/internal/routes/auth"
	service "auth-service/internal/services/auth"
	"auth-service/internal/utils"

	"github.com/gin-gonic/gin"
)

type Module struct {
	context *context.Context
	handler *handler.Handler
}

func New(ctx *context.Context) *Module {
	return &Module{
		context: ctx,
		handler: nil,
	}
}
func (m *Module) Init() error {
	userRepo, err := repository.NewUserRepository("mongo", m.context.DB, m.context.Config.DBName, m.context.Config.Collections.Users)
	if err != nil {
		utils.Logger.WithError(err).Error("Failed to initialize UserRepository")
		return err
	}
	authService := service.New(userRepo, m.context.Config.JwtSecret)
	m.handler = handler.New(authService)
	return nil
}

func (m *Module) RegisterRoutes(router *gin.Engine) {
	routes.Register(router, m.handler, m.context)
}
