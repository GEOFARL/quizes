package context

import (
	"auth-service/config"
	"auth-service/internal/utils"

	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/mongo"
)

type Context struct {
	Config *config.Config
	Logger *logrus.Logger
	DB     *mongo.Client
}

func NewContext() *Context {
	cfg := config.LoadConfig()
	utils.InitializeLogger()
	db := utils.ConnectDB(cfg.DbURI)
	return &Context{
		Config: cfg,
		Logger: utils.Logger,
		DB:     db,
	}
}
