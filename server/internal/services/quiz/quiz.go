package quiz

import (
	"auth-service/internal/models"
	repository "auth-service/internal/repositories/quiz"
	"auth-service/internal/services/category"
	"auth-service/internal/utils"
	"errors"

	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Service struct {
	repo            repository.Repository
	categoryService *category.Service
}

func New(repo repository.Repository, categoryService *category.Service) *Service {
	return &Service{repo: repo, categoryService: categoryService}
}

func (s *Service) SaveQuizWithCategory(userID string, quiz models.Quiz, categoryID string, newCategory *models.Category) (string, error) {
	userObjectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return "", errors.New("invalid user ID")
	}

	utils.Logger.WithField("convertedUserID", userObjectID.Hex()).Info("Converted userID to ObjectID")

	quiz.UserID = userObjectID
	utils.Logger.WithField("quizUserID", quiz.UserID.Hex()).Info("Assigned UserID to quiz")

	// Create a new category if provided
	if newCategory != nil {
		newCategory.UserID = userObjectID
		utils.Logger.WithField("newCategory", newCategory).Info("Creating new category")

		newCategoryID, err := s.categoryService.CreateCategory(newCategory)
		if err != nil {
			return "", err
		}

		categoryID = newCategoryID
		utils.Logger.WithField("newCategoryID", categoryID).Info("New category created successfully")
	}

	// Validate and assign categoryID
	if categoryID != "" {
		categoryObjectID, err := primitive.ObjectIDFromHex(categoryID)
		if err != nil {
			return "", errors.New("invalid category ID")
		}

		quiz.CategoryID = categoryObjectID
		utils.Logger.WithField("quizCategoryID", quiz.CategoryID.Hex()).Info("Assigned CategoryID to quiz")
	} else {
		return "", errors.New("category ID is required")
	}

	// Save the quiz
	utils.Logger.WithFields(logrus.Fields{
		"quizUserID":     quiz.UserID.Hex(),
		"quizCategoryID": quiz.CategoryID.Hex(),
		"quizName":       quiz.Name,
	}).Info("Final quiz payload before saving")

	err = s.repo.SaveQuiz(quiz)
	if err != nil {
		utils.Logger.WithError(err).Error("Failed to save quiz")
		return "", err
	}

	utils.Logger.WithField("savedCategoryID", categoryID).Info("Quiz saved successfully with category")
	return categoryID, nil
}

func (s *Service) GetUserQuizzes(userID string, pagination utils.Pagination, categoryIDs []string) ([]models.Quiz, utils.Pagination, error) {
	quizzes, err := s.repo.GetQuizzesByUser(userID, pagination, categoryIDs)
	if err != nil {
		return nil, pagination, err
	}

	total, err := s.repo.CountQuizzesByUser(userID, categoryIDs)
	if err != nil {
		return nil, pagination, err
	}

	pagination.Total = int(total)
	return quizzes, pagination, nil
}

func (s *Service) DeleteQuiz(userID string, quizID string) error {
	quizObjectID, err := primitive.ObjectIDFromHex(quizID)
	if err != nil {
		return errors.New("invalid quiz ID")
	}

	userObjectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return errors.New("invalid user ID")
	}

	return s.repo.DeleteQuiz(userObjectID, quizObjectID)
}
