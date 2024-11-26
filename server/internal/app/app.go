package app

import (
	"auth-service/internal/context"
	"auth-service/internal/modules"
	"auth-service/internal/utils"
	"os"

	"github.com/gin-gonic/gin"
)

type App struct {
	Router  *gin.Engine
	Context *context.Context
}

func NewApp(ctx *context.Context) *App {
	return &App{
		Router: gin.Default(),
	}
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
	app := NewApp(ctx)

	modules := []modules.Module{
		modules.NewAuthModule(ctx),
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
