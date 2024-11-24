package services

import (
	"auth-service/internal/models"
	"auth-service/internal/repositories"
	"auth-service/internal/utils"
	"errors"

	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	repo      *repositories.UserRepository
	jwtSecret string
}

func NewAuthService(repo *repositories.UserRepository, jwtSecret string) *AuthService {
	return &AuthService{repo: repo, jwtSecret: jwtSecret}
}

type RegisterRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (s *AuthService) Register(req RegisterRequest) error {
	if _, err := s.repo.FindByUsername(req.Username); err == nil {
		return errors.New("username already exists")
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	return s.repo.Create(models.User{Username: req.Username, Password: string(hashedPassword)})
}

func (s *AuthService) Login(req LoginRequest) (string, error) {
	user, err := s.repo.FindByUsername(req.Username)
	if err != nil {
		return "", errors.New("invalid username or password")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return "", errors.New("invalid username or password")
	}

	return utils.GenerateJWT(req.Username, s.jwtSecret)
}
