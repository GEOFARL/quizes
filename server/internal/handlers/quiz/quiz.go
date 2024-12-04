package quiz

import (
	"auth-service/internal/models"
	"auth-service/internal/services/quiz"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	quizService *quiz.Service
}

func New(quizService *quiz.Service) *Handler {
	return &Handler{quizService: quizService}
}

func (h *Handler) SaveQuiz(c *gin.Context) {
	var req models.Quiz
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if err := h.quizService.SaveQuiz(userID.(string), req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Quiz saved successfully"})
}

func (h *Handler) GetQuizzes(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	quizzes, err := h.quizService.GetUserQuizzes(userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, quizzes)
}
