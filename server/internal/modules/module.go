package modules

import (
	"auth-service/config"

	"github.com/gin-gonic/gin"
)

type Module interface {
	Init(router *gin.Engine) error
}

type context struct {
	db     interface{}
	config *config.Config
}

func NewContext(db interface{}, cfg *config.Config) *context {
	return &context{
		db:     db,
		config: cfg,
	}
}
