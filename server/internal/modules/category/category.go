package categories

import (
	"auth-service/internal/context"
	handler "auth-service/internal/handlers/category"
	repository "auth-service/internal/repositories/category"
	routes "auth-service/internal/routes/category"
	service "auth-service/internal/services/category"

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
	repo := repository.NewCategoryRepository(
		m.context.DB.(*mongo.Client),
		m.context.Config.DBName,
		m.context.Config.Collections.Categories,
		m.context.Config.Collections.DefaultCategories,
	)
	categoryService := service.New(repo)
	m.handler = handler.NewHandler(categoryService)
	return nil
}

func (m *Module) RegisterRoutes(router *gin.Engine) {
	routes.Register(router, m.handler, m.context)
}
