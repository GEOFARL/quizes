package quiz

import (
	"auth-service/internal/context"
	handler "auth-service/internal/handlers/quiz"
	categoryRepo "auth-service/internal/repositories/category"
	quizRepo "auth-service/internal/repositories/quiz"
	"auth-service/internal/routes/quiz"
	categoryService "auth-service/internal/services/category"
	quizService "auth-service/internal/services/quiz"

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
	quizRepository := quizRepo.NewQuizRepository(
		m.context.DB.(*mongo.Client),
		m.context.Config.DBName,
		m.context.Config.Collections,
	)

	categoryRepository := categoryRepo.NewCategoryRepository(
		m.context.DB.(*mongo.Client),
		m.context.Config.DBName,
		m.context.Config.Collections.Categories,
		m.context.Config.Collections.DefaultCategories,
	)

	categorySvc := categoryService.New(categoryRepository)
	quizSvc := quizService.New(*quizRepository, categorySvc)

	m.handler = handler.New(quizSvc)
	return nil
}

func (m *Module) RegisterRoutes(router *gin.Engine) {
	quiz.Register(router, m.handler, m.context)
}
