package quiz

import (
	"auth-service/internal/models"
	"auth-service/internal/utils"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
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

func (r *Repository) GetQuizzesByUser(userID string, pagination utils.Pagination) ([]models.Quiz, error) {
	var quizzes []models.Quiz
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	filter := bson.M{"userId": objectID}
	findOptions := options.Find().
		SetSkip(int64(pagination.Skip)).
		SetLimit(int64(pagination.Limit)).
		SetSort(bson.D{{Key: "createdAt", Value: -1}})

	cursor, err := r.collection.Find(ctx, filter, findOptions)
	if err != nil {
		return nil, err
	}

	if err := cursor.All(ctx, &quizzes); err != nil {
		return nil, err
	}

	return quizzes, nil
}

func (r *Repository) CountQuizzesByUser(userID string) (int64, error) {
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return 0, err
	}

	filter := bson.M{"userId": objectID}
	return r.collection.CountDocuments(context.Background(), filter)
}
