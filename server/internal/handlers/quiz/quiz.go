package quiz

import (
	"auth-service/internal/models"
	"auth-service/internal/services/quiz"
	"auth-service/internal/utils"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Handler struct {
	quizService *quiz.Service
}

func New(quizService *quiz.Service) *Handler {
	return &Handler{quizService: quizService}
}

func (h *Handler) SaveQuiz(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	userIDStr, ok := userID.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user ID"})
		return
	}

	userObjectID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var req struct {
		Quiz        models.Quiz      `json:"quiz"`
		NewCategory *models.Category `json:"newCategory,omitempty"`
		CategoryID  string           `json:"categoryID,omitempty"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Logger.WithError(err).Error("Failed to bind request JSON")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	utils.Logger.WithFields(logrus.Fields{
		"userID":      userObjectID.Hex(),
		"quiz":        req.Quiz,
		"newCategory": req.NewCategory,
		"categoryID":  req.CategoryID,
	}).Info("Received SaveQuiz request")

	// Validate required fields
	if req.Quiz.Name == "" || len(req.Quiz.Questions) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Quiz name and questions are required"})
		return
	}

	req.Quiz.UserID = userObjectID
	if req.NewCategory != nil {
		req.NewCategory.UserID = userObjectID
	}

	categoryID, err := h.quizService.SaveQuizWithCategory(
		userObjectID.Hex(),
		req.Quiz,
		req.CategoryID,
		req.NewCategory,
	)
	if err != nil {
		utils.Logger.WithError(err).Error("Failed to save quiz")
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":     "Quiz saved successfully",
		"category_id": categoryID,
	})
}

func (h *Handler) GetQuizzes(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	page := c.DefaultQuery("page", "1")
	limit := c.DefaultQuery("limit", "10")
	categoriesParam := c.Query("categories")

	var categories []string
	if categoriesParam != "" {
		categories = strings.Split(categoriesParam, ",")
	}

	pageNum, err := strconv.Atoi(page)
	if err != nil || pageNum < 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page number"})
		return
	}

	limitNum, err := strconv.Atoi(limit)
	if err != nil || limitNum < 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid limit number"})
		return
	}

	quizzes, pagination, err := h.quizService.GetUserQuizzes(
		userID.(string),
		utils.NewPagination(pageNum, limitNum),
		categories,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":       quizzes,
		"pagination": pagination,
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
