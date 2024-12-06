package category

import (
	"auth-service/internal/models"
	repository "auth-service/internal/repositories/category"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Service struct {
	repo repository.Repository
}

func New(repo repository.Repository) *Service {
	return &Service{repo: repo}
}
func (s *Service) CreateCategory(category *models.Category) (string, error) {
	category.ID = primitive.NewObjectID()
	category.CreatedAt = time.Now()

	isDuplicate, err := s.repo.IsCategoryNameDuplicate(category.UserID, category.Name)
	if err != nil {
		return "", err
	}

	if isDuplicate {
		return "", errors.New("category name already exists")
	}

	err = s.repo.SaveCategory(category)
	if err != nil {
		return "", err
	}

	return category.ID.Hex(), nil
}

func (s *Service) GetCategoriesByUser(userID string) ([]models.Category, error) {
	userObjectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	return s.repo.GetCategoriesByUser(userObjectID)
}

func (s *Service) GetCategoryByID(categoryID string) (*models.Category, error) {
	categoryObjectID, err := primitive.ObjectIDFromHex(categoryID)
	if err != nil {
		return nil, err
	}

	return s.repo.GetCategoryByID(categoryObjectID)
}