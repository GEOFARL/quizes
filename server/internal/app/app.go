package app

import (
	"auth-service/internal/context"
	"auth-service/internal/middleware"
	"auth-service/internal/modules"
	authModule "auth-service/internal/modules/auth"
	questionModule "auth-service/internal/modules/question"
	"auth-service/internal/utils"
	"os"

	"github.com/gin-gonic/gin"
)

type App struct {
	Router  *gin.Engine
	Context *context.Context
}

func New(ctx *context.Context) *App {
	return &App{
		Router:  gin.Default(),
		Context: ctx,
	}
}

func (a *App) InitMiddleware() {
	middleware.LoadCORS(a.Router, a.Context.Config)
}

func (a *App) RegisterModules(modules ...modules.Module) error {
	for _, module := range modules {
		if err := module.Init(); err != nil {
			return err
		}
		module.RegisterRoutes(a.Router)
	}
	return nil
}

func InitializeApp(ctx *context.Context) *App {
	app := New(ctx)

	app.InitMiddleware()

	modules := []modules.Module{
		authModule.New(ctx),
		questionModule.New(ctx),
	}

	if err := app.RegisterModules(modules...); err != nil {
		utils.Logger.WithError(err).Fatal("Failed to initialize modules")
	}

	return app
}

func (app *App) Run() {
	utils.Logger.WithField("port", app.Context.Config.Port).Info("Server running")
	if err := app.Router.Run(":" + app.Context.Config.Port); err != nil {
		utils.Logger.WithError(err).Error("Failed to start the server")
		os.Exit(1)
	}
}
