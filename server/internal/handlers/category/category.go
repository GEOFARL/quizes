package categories

import (
	"auth-service/internal/models"
	categories "auth-service/internal/services/category"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Handler struct {
	categoryService *categories.Service
}

func NewHandler(categoryService *categories.Service) *Handler {
	return &Handler{categoryService: categoryService}
}

func (h *Handler) GetUserCategories(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	categories, err := h.categoryService.GetCategoriesByUser(userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": categories})
}

func (h *Handler) CreateCategory(c *gin.Context) {
	var req models.Category
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	userObjectID, err := primitive.ObjectIDFromHex(userID.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	req.UserID = userObjectID

	categoryID, err := h.categoryService.CreateCategory(&req)
	if err != nil {
		if err.Error() == "category name already exists" {
			c.JSON(http.StatusConflict, gin.H{"error": "Category name already exists"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id":      categoryID,
		"message": "Category created successfully",
	})
}
