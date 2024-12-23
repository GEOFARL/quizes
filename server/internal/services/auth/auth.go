package auth

import (
	"auth-service/internal/models"
	repository "auth-service/internal/repositories/user"
	"auth-service/internal/utils"
	"errors"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type Service struct {
	repo      repository.UserRepository
	jwtSecret string
}

func New(repo repository.UserRepository, jwtSecret string) *Service {
	return &Service{repo: repo, jwtSecret: jwtSecret}
}

type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	FullName string `json:"fullName"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (s *Service) Register(req RegisterRequest) (string, error) {
	if _, err := s.repo.FindByEmail(req.Email); err == nil {
		utils.Logger.WithField("email", req.Email).Warn("Email already exists")
		return "", errors.New("email already exists")
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)

	user := models.User{
		Email:     req.Email,
		FullName:  req.FullName,
		Password:  string(hashedPassword),
		CreatedAt: time.Now(),
	}
	if err := s.repo.Create(user); err != nil {
		utils.Logger.WithError(err).Error("Failed to create user")
		return "", err
	}

	token, err := utils.GenerateJWT(user.ToTokenClaims(), s.jwtSecret)
	if err != nil {
		utils.Logger.WithError(err).Error("Failed to generate JWT")
		return "", err
	}

	utils.Logger.WithField("email", req.Email).Info("User registered successfully")
	return token, nil
}

func (s *Service) Login(req LoginRequest) (string, error) {
	user, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		utils.Logger.WithField("email", req.Email).Warn("Invalid email or password")
		return "", errors.New("invalid email or password")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		utils.Logger.WithField("email", req.Email).Warn("Invalid email or password")
		return "", errors.New("invalid email or password")
	}

	token, err := utils.GenerateJWT(user.ToTokenClaims(), s.jwtSecret)
	if err != nil {
		utils.Logger.WithError(err).Error("Failed to generate JWT")
		return "", err
	}

	utils.Logger.WithField("user_id", user.ID.Hex()).Info("User logged in successfully")
	return token, nil
}
