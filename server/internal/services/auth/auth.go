package auth

import (
	"auth-service/internal/models"
	repository "auth-service/internal/repositories/user"
	"auth-service/internal/utils"
	"errors"

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
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (s *Service) Register(req RegisterRequest) error {
	// Check if the email already exists
	if _, err := s.repo.FindByEmail(req.Email); err == nil {
		utils.Logger.WithField("email", req.Email).Warn("Email already exists")
		return errors.New("email already exists")
	}

	// Hash the password and create the user
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err := s.repo.Create(models.User{Email: req.Email, Password: string(hashedPassword)}); err != nil {
		utils.Logger.WithError(err).Error("Failed to create user")
		return err
	}

	utils.Logger.WithField("email", req.Email).Info("User registered successfully")
	return nil
}

func (s *Service) Login(req LoginRequest) (string, error) {
	// Find user by email
	user, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		utils.Logger.WithField("email", req.Email).Warn("Invalid email or password")
		return "", errors.New("invalid email or password")
	}

	// Compare the hashed password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		utils.Logger.WithField("email", req.Email).Warn("Invalid email or password")
		return "", errors.New("invalid email or password")
	}

	// Generate JWT
	token, err := utils.GenerateJWT(user.ID.Hex(), s.jwtSecret)
	if err != nil {
		utils.Logger.WithError(err).Error("Failed to generate JWT")
		return "", err
	}

	utils.Logger.WithField("user_id", user.ID.Hex()).Info("User logged in successfully")
	return token, nil
}
