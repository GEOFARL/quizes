package quiz

import (
	"auth-service/internal/models"
	"auth-service/internal/services/quiz"
	"auth-service/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

type Handler struct {
	quizService *quiz.Service
}

func New(quizService *quiz.Service) *Handler {
	return &Handler{quizService: quizService}
}

func (h *Handler) SaveQuiz(c *gin.Context) {
	var req struct {
		models.Quiz
		CategoryID  string           `json:"categoryId"`
		NewCategory *models.Category `json:"newCategory,omitempty"`
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	categoryID, err := h.quizService.SaveQuizWithCategory(userID.(string), req.Quiz, req.CategoryID, req.NewCategory)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":    "Quiz saved successfully",
		"categoryId": categoryID,
	})
}

func (h *Handler) GetQuizzes(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	pagination, err := utils.GetPagination(c, 1, 10)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	quizzes, updatedPagination, err := h.quizService.GetUserQuizzes(userID.(string), pagination)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":       quizzes,
		"pagination": updatedPagination,
	})
}

func (h *Handler) DeleteQuiz(c *gin.Context) {
	quizID := c.Param("quiz_id")
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	if err := h.quizService.DeleteQuiz(userID.(string), quizID); err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Quiz not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Quiz deleted successfully"})
}
