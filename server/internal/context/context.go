package context

import (
	"auth-service/config"
	"auth-service/internal/utils"
)

type Context struct {
	Config *config.Config
	DB     interface{}
}

func NewContext() *Context {
	utils.InitializeLogger()
	cfg := config.LoadConfig()
	db := utils.ConnectDB(cfg.DBURI)
	return &Context{
		Config: cfg,
		DB:     db,
	}
}
