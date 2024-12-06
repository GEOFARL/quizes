package category

import (
	"auth-service/internal/context"
	handler "auth-service/internal/handlers/category"
	"auth-service/internal/middleware"

	"github.com/gin-gonic/gin"
)

func Register(router *gin.Engine, handler *handler.Handler, ctx *context.Context) {
	categoryRoutes := router.Group("/categories")
	categoryRoutes.Use(middleware.ValidateJWT(ctx.Config.JwtSecret))

	categoryRoutes.GET("", handler.GetUserCategories)
	categoryRoutes.POST("/create", handler.CreateCategory)
}
