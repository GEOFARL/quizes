package repository

import (
	"auth-service/internal/models"
	"auth-service/internal/utils"
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type MongoUserRepository struct {
	collection *mongo.Collection
}

func NewMongoUserRepository(client *mongo.Client, dbName string, collectionName string) *MongoUserRepository {
	collection := client.Database(dbName).Collection(collectionName)
	return &MongoUserRepository{collection: collection}
}

func (r *MongoUserRepository) FindByUsername(username string) (*models.User, error) {
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

func (r *MongoUserRepository) Create(user models.User) error {
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
