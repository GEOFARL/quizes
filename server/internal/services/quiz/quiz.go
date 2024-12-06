package quiz

import (
	"auth-service/internal/models"
	repository "auth-service/internal/repositories/quiz"
	"auth-service/internal/utils"
	"errors"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Service struct {
	repo repository.Repository
}

func New(repo repository.Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) SaveQuiz(userID string, quiz models.Quiz) error {
	userObjectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return errors.New("invalid user ID")
	}

	quiz.UserID = userObjectID
	return s.repo.SaveQuiz(quiz)
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
