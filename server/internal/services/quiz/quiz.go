package quiz

import (
	"auth-service/internal/models"
	repository "auth-service/internal/repositories/quiz"
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

func (s *Service) GetUserQuizzes(userID string) ([]models.Quiz, error) {
	return s.repo.GetQuizzesByUser(userID)
}
