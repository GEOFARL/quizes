package app

import (
	"auth-service/config"
	"auth-service/internal/modules"
	"auth-service/internal/utils"
	"os"

	"github.com/gin-gonic/gin"
)

type App struct {
	Config *config.Config
	Router *gin.Engine
}

func NewApp(cfg *config.Config) *App {
	return &App{
		Config: cfg,
		Router: gin.Default(),
	}
}

func (a *App) RegisterModules(modules ...modules.Module) error {
	for _, module := range modules {
		if err := module.Init(a.Router); err != nil {
			return err
		}
	}
	return nil
}

func InitializeApp(cfg *config.Config, db interface{}) *App {
	app := NewApp(cfg)

	ctx := modules.NewContext(db, cfg)
	modules := []modules.Module{
		modules.NewAuthModule(ctx),
	}

	if err := app.RegisterModules(modules...); err != nil {
		utils.Logger.WithError(err).Fatal("Failed to initialize modules")
	}

	return app
}

func (app *App) Run() {
	utils.Logger.WithField("port", app.Config.Port).Info("Server running")
	if err := app.Router.Run(":" + app.Config.Port); err != nil {
		utils.Logger.WithError(err).Error("Failed to start the server")
		os.Exit(1)
	}
}
