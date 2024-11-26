package routes

import (
	"auth-service/internal/context"
	"auth-service/internal/handlers"
	"auth-service/internal/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterAuthRoutes(router *gin.Engine, authHandler *handlers.AuthHandler, ctx *context.Context) {
	auth := router.Group(ctx.Config.Routes.Auth.Base)
	auth.POST(ctx.Config.Routes.Auth.Register, authHandler.Register)
	auth.POST(ctx.Config.Routes.Auth.Login, authHandler.Login)

	protected := router.Group(ctx.Config.Routes.Protected.Base)
	protected.Use(middleware.ValidateJWT(ctx.Config.JwtSecret))
	protected.GET(ctx.Config.Routes.Protected.Profile, authHandler.Profile)
}
