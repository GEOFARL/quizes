package quiz

import (
	"auth-service/internal/models"
	"auth-service/internal/utils"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Repository struct {
	collection *mongo.Collection
}

func NewQuizRepository(client *mongo.Client, dbName string, collectionName string) *Repository {
	collection := client.Database(dbName).Collection(collectionName)
	return &Repository{collection: collection}
}

func (r *Repository) SaveQuiz(quiz models.Quiz) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	quiz.CreatedAt = time.Now()
	_, err := r.collection.InsertOne(ctx, quiz)
	return err
}

func (r *Repository) GetQuizzesByUser(userID string) ([]models.Quiz, error) {
	var quizzes []models.Quiz
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		utils.Logger.WithError(err).Error("Invalid userID format")
		return nil, err
	}

	utils.Logger.WithField("userID", objectID).Info("Fetching quizzes for user")

	filter := bson.M{"userId": objectID}
	cursor, err := r.collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	if err = cursor.All(ctx, &quizzes); err != nil {
		return nil, err
	}

	return quizzes, nil
}
