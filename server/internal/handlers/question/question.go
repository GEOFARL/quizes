package question

import (
	"auth-service/internal/services/question"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	questionService *question.Service
}

func NewHandler(service *question.Service) *Handler {
	return &Handler{questionService: service}
}

type QuestionRequest struct {
	Text string `json:"text" binding:"required"`
}

type QuestionResponse struct {
	Questions []question.Question `json:"questions"`
}

func (h *Handler) GenerateQuestions(c *gin.Context) {
	var req QuestionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	questions, err := h.questionService.GenerateQuestions(req.Text)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, QuestionResponse{Questions: questions})
}
