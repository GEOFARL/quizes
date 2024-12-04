package quiz

import (
	"auth-service/internal/context"
	handler "auth-service/internal/handlers/quiz"
	repository "auth-service/internal/repositories/quiz"
	"auth-service/internal/routes/quiz"
	service "auth-service/internal/services/quiz"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

type Module struct {
	context *context.Context
	handler *handler.Handler
}

func New(ctx *context.Context) *Module {
	return &Module{
		context: ctx,
		handler: nil,
	}
}

func (m *Module) Init() error {
	repo := repository.NewQuizRepository(m.context.DB.(*mongo.Client), m.context.Config.DBName, m.context.Config.Collections.Quizzes)
	quizService := service.New(*repo)
	m.handler = handler.New(quizService)
	return nil
}

func (m *Module) RegisterRoutes(router *gin.Engine) {
	quiz.Register(router, m.handler, m.context)
}
