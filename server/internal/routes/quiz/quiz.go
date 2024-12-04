package quiz

import (
	"auth-service/internal/context"
	"auth-service/internal/handlers/quiz"
	"auth-service/internal/middleware"

	"github.com/gin-gonic/gin"
)

func Register(router *gin.Engine, quizHandler *quiz.Handler, ctx *context.Context) {
	quizRoutes := router.Group("/quiz")
	quizRoutes.Use(middleware.ValidateJWT(ctx.Config.JwtSecret))

	quizRoutes.POST("/save", quizHandler.SaveQuiz)
	quizRoutes.GET("", quizHandler.GetQuizzes)
}
