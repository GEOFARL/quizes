package user

import (
	"auth-service/internal/models"
	"errors"

	"go.mongodb.org/mongo-driver/mongo"
)

type UserRepository interface {
	FindByEmail(email string) (*models.User, error)
	Create(user models.User) error
}

func NewUserRepository(dbType string, dbClient interface{}, dbName, collectionName string) (UserRepository, error) {
	switch dbType {
	case "mongo":
		client, ok := dbClient.(*mongo.Client)
		if !ok {
			return nil, errors.New("invalid MongoDB client")
		}
		return NewMongoRepository(client, dbName, collectionName), nil
	default:
		return nil, errors.New("unsupported database type")
	}
}
