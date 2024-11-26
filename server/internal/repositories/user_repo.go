package repositories

import (
	"auth-service/config"
	"auth-service/internal/models"
	"auth-service/internal/utils"
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserRepository struct {
	collection *mongo.Collection
}

func NewUserRepository(client *mongo.Client, cfg *config.Config) *UserRepository {
	collection := client.Database(cfg.DBName).Collection(cfg.Collections.Users)
	return &UserRepository{collection: collection}
}

func (r *UserRepository) FindByUsername(username string) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.User
	err := r.collection.FindOne(ctx, bson.M{"username": username}).Decode(&user)
	if err == mongo.ErrNoDocuments {
		return nil, errors.New("user not found")
	} else if err != nil {
		utils.Logger.WithError(err).Error("Error while finding user by username")
		return nil, err
	}

	utils.Logger.WithField("username", username).Info("User found")
	return &user, nil
}

func (r *UserRepository) Create(user models.User) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	user.CreatedAt = time.Now()
	_, err := r.collection.InsertOne(ctx, user)
	if err != nil {
		utils.Logger.WithError(err).Error("Error while creating user")
		return err
	}

	utils.Logger.WithField("username", user.Username).Info("User created successfully")
	return nil
}
