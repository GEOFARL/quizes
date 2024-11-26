package services

import (
	"auth-service/internal/models"
	repository "auth-service/internal/repositories/user"
	"auth-service/internal/utils"
	"errors"

	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	repo      repository.UserRepository
	jwtSecret string
}

func NewAuthService(repo repository.UserRepository, jwtSecret string) *AuthService {
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
		utils.Logger.WithField("username", req.Username).Warn("Username already exists")
		return errors.New("username already exists")
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err := s.repo.Create(models.User{Username: req.Username, Password: string(hashedPassword)}); err != nil {
		utils.Logger.WithError(err).Error("Failed to create user")
		return err
	}

	utils.Logger.WithField("username", req.Username).Info("User registered successfully")
	return nil
}

func (s *AuthService) Login(req LoginRequest) (string, error) {
	user, err := s.repo.FindByUsername(req.Username)
	if err != nil {
		utils.Logger.WithField("username", req.Username).Warn("Invalid username or password")
		return "", errors.New("invalid username or password")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		utils.Logger.WithField("username", req.Username).Warn("Invalid username or password")
		return "", errors.New("invalid username or password")
	}

	token, err := utils.GenerateJWT(req.Username, s.jwtSecret)
	if err != nil {
		utils.Logger.WithError(err).Error("Failed to generate JWT")
		return "", err
	}

	utils.Logger.WithField("username", req.Username).Info("User logged in successfully")
	return token, nil
}
