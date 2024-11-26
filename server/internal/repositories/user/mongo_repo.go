package user

import (
	"auth-service/internal/models"
	"auth-service/internal/utils"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type MongoRepository struct {
	collection *mongo.Collection
}

func NewMongoRepository(client *mongo.Client, dbName string, collectionName string) *MongoRepository {
	collection := client.Database(dbName).Collection(collectionName)
	return &MongoRepository{collection: collection}
}

func (r *MongoRepository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	filter := bson.M{"email": email}
	err := r.collection.FindOne(context.TODO(), filter).Decode(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *MongoRepository) Create(user models.User) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	user.CreatedAt = time.Now()
	_, err := r.collection.InsertOne(ctx, user)
	if err != nil {
		utils.Logger.WithError(err).Error("Error while creating user")
		return err
	}

	utils.Logger.WithField("email", user.Email).Info("User created successfully")
	return nil
}
