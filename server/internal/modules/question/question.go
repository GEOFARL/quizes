package question

import (
	"auth-service/internal/context"
	handler "auth-service/internal/handlers/question"
	"auth-service/internal/routes/questions"
	service "auth-service/internal/services/question"

	"github.com/gin-gonic/gin"
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
	questionService := service.New(service.NewOpenAIService(m.context.Config.OpenAIKey), m.context.Config.Environment)
	m.handler = handler.NewHandler(questionService)
	return nil
}

func (m *Module) RegisterRoutes(router *gin.Engine) {
	questions.Register(router, m.handler, m.context)
}
