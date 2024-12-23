package auth

import (
	"auth-service/internal/services/auth"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	authService *auth.Service
}

func New(authService *auth.Service) *Handler {
	return &Handler{authService: authService}
}

func (h *Handler) Register(c *gin.Context) {
	var req auth.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	token, err := h.authService.Register(req)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "user registered successfully",
		"token":   token,
	})
}

func (h *Handler) Login(c *gin.Context) {
	var req auth.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	token, err := h.authService.Login(req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

func (h *Handler) Profile(c *gin.Context) {
	userID, _ := c.Get("user_id")
	c.JSON(http.StatusOK, gin.H{
		"message": "Welcome!",
		"user_id": userID,
	})
}
