package modules

import (
	"github.com/gin-gonic/gin"
)

type Module interface {
	Init(router *gin.Engine) error
}
