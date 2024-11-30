package questions

import (
	"auth-service/internal/context"
	"auth-service/internal/handlers/question"

	"github.com/gin-gonic/gin"
)

func Register(router *gin.Engine, questionsHandler *question.Handler, ctx *context.Context) {
	router.POST("/questions", questionsHandler.GenerateQuestions)
}
