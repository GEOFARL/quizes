package modules

import (
	"github.com/gin-gonic/gin"
)

type Module interface {
	Init() error
	RegisterRoutes(router *gin.Engine)
}
