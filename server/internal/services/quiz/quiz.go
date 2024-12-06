package quiz

import (
	"auth-service/internal/models"
	repository "auth-service/internal/repositories/quiz"
	"auth-service/internal/services/category"
	"auth-service/internal/utils"
	"errors"

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

	if newCategory != nil {
		newCategory.UserID = userObjectID
		newCategoryID, err := s.categoryService.CreateCategory(newCategory)
		if err != nil {
			return "", err
		}
		categoryID = newCategoryID
	}

	if categoryID != "" {
		categoryObjectID, err := primitive.ObjectIDFromHex(categoryID)
		if err != nil {
			return "", errors.New("invalid category ID")
		}
		quiz.CategoryID = categoryObjectID
	} else {
		return "", errors.New("category ID is required")
	}

	quiz.UserID = userObjectID
	err = s.repo.SaveQuiz(quiz)
	if err != nil {
		return "", err
	}

	return categoryID, nil
}

func (s *Service) GetUserQuizzes(userID string, pagination utils.Pagination) ([]models.Quiz, utils.Pagination, error) {
	quizzes, err := s.repo.GetQuizzesByUser(userID, pagination)
	if err != nil {
		return nil, pagination, err
	}

	total, err := s.repo.CountQuizzesByUser(userID)
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
