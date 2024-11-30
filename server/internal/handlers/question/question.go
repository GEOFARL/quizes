package question

import (
	"auth-service/internal/services/question"
	"auth-service/internal/utils"
	fileprocessor "auth-service/internal/utils/file-processor"
	"errors"
	"mime/multipart"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/sirupsen/logrus"
)

type Handler struct {
	questionService *question.Service
	fileProcessors  map[string]fileprocessor.FileProcessor
}

func NewHandler(service *question.Service) *Handler {
	return &Handler{
		questionService: service,
		fileProcessors:  fileprocessor.RegisterProcessors(),
	}
}

type QuestionRequest struct {
	Text string                `form:"text" binding:"omitempty"`
	File *multipart.FileHeader `form:"file" binding:"omitempty"`
}

type QuestionResponse struct {
	Questions []question.Question `json:"questions"`
}

func (h *Handler) GenerateQuestions(c *gin.Context) {
	var req QuestionRequest

	if err := c.ShouldBindWith(&req, binding.FormMultipart); err != nil {
		utils.Logger.WithError(err).Error("Failed to bind request")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	utils.Logger.WithFields(logrus.Fields{
		"text_provided": req.Text != "",
		"file_provided": req.File != nil,
	}).Debug("Validating request inputs")

	text, err := h.getTextFromRequest(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	utils.Logger.WithFields(logrus.Fields{
		"extracted_text_length": len(text),
		"extracted_text":        utils.TruncateText(text, 500),
	}).Info("Text extracted successfully")

	questions, err := h.questionService.GenerateQuestions(text)
	if err != nil {
		utils.Logger.WithError(err).Error("Failed to generate questions")
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, QuestionResponse{Questions: questions})
}

func (h *Handler) getTextFromRequest(req QuestionRequest) (string, error) {
	if req.Text != "" && req.File != nil {
		utils.Logger.Warn("Both text and file provided")
		return "", errors.New("provide either text or a file, but not both")
	}
	if req.Text == "" && req.File == nil {
		utils.Logger.Warn("Neither text nor file provided")
		return "", errors.New("provide either text or a file")
	}

	if req.File != nil {
		fileReader, err := req.File.Open()
		if err != nil {
			utils.Logger.WithError(err).Error("Failed to open file")
			return "", errors.New("failed to open file")
		}
		defer fileReader.Close()

		ext := fileprocessor.GetFileExtension(req.File.Filename)
		processor, found := h.fileProcessors[ext]
		if !found {
			return "", errors.New("unsupported file type. Only TXT and PDF are allowed")
		}

		return processor.Process(fileReader)
	}

	return req.Text, nil
}
