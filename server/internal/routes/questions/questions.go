package questions

import (
	"auth-service/internal/context"
	"auth-service/internal/handlers/question"
	"auth-service/internal/middleware"

	"github.com/gin-gonic/gin"
)

func Register(router *gin.Engine, questionsHandler *question.Handler, ctx *context.Context) {
	router.POST("/questions", middleware.ValidateJWT(ctx.Config.JwtSecret), questionsHandler.GenerateQuestions)
}
