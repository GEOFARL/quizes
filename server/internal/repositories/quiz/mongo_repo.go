package quiz

import (
	"auth-service/config"
	"auth-service/internal/models"
	"auth-service/internal/utils"
	"context"
	"time"

	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Repository struct {
	quizzesCollection           *mongo.Collection
	categoriesCollection        *mongo.Collection
	defaultCategoriesCollection *mongo.Collection
}

func NewQuizRepository(client *mongo.Client, dbName string, collections *config.Collections) *Repository {
	return &Repository{
		quizzesCollection:           client.Database(dbName).Collection(collections.Quizzes),
		categoriesCollection:        client.Database(dbName).Collection(collections.Categories),
		defaultCategoriesCollection: client.Database(dbName).Collection(collections.DefaultCategories),
	}
}

func (r *Repository) SaveQuiz(quiz models.Quiz) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	quiz.CreatedAt = time.Now()
	utils.Logger.WithField("quizToSave", quiz).Info("Saving quiz to MongoDB")

	_, err := r.quizzesCollection.InsertOne(ctx, quiz)
	if err != nil {
		utils.Logger.WithError(err).Error("Failed to insert quiz into MongoDB")
	}
	return err
}

func (r *Repository) GetQuizzesByUser(userID string, pagination utils.Pagination, categoryIDs []string) ([]models.Quiz, error) {
	var quizzes []models.Quiz
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	filter := bson.M{"userId": objectID}

	if len(categoryIDs) > 0 {
		categoryObjectIDs := []primitive.ObjectID{}
		for _, id := range categoryIDs {
			if id == "" {
				continue
			}
			categoryObjectID, err := primitive.ObjectIDFromHex(id)
			if err != nil {
				return nil, err
			}
			categoryObjectIDs = append(categoryObjectIDs, categoryObjectID)
		}

		if len(categoryObjectIDs) > 0 {
			filter["categoryId"] = bson.M{"$in": categoryObjectIDs}
		}
	}

	utils.Logger.WithFields(logrus.Fields{
		"page":  pagination.Page,
		"limit": pagination.Limit,
		"skip":  pagination.Skip,
	}).Info("Pagination values")

	pipeline := []bson.M{
		{"$match": filter},
		{"$sort": bson.D{{Key: "createdAt", Value: -1}}},
		{"$skip": int64(pagination.Skip)},
		{"$limit": int64(pagination.Limit)},
		{
			"$lookup": bson.M{
				"from": r.categoriesCollection.Name(),
				"let":  bson.M{"categoryId": "$categoryId"},
				"pipeline": []bson.M{
					{
						"$match": bson.M{
							"$expr": bson.M{
								"$eq": []interface{}{"$_id", "$$categoryId"},
							},
						},
					},
				},
				"as": "userCategoryDetails",
			},
		},
		{
			"$lookup": bson.M{
				"from": r.defaultCategoriesCollection.Name(),
				"let":  bson.M{"categoryId": "$categoryId"},
				"pipeline": []bson.M{
					{
						"$match": bson.M{
							"$expr": bson.M{
								"$eq": []interface{}{"$_id", "$$categoryId"},
							},
						},
					},
				},
				"as": "defaultCategoryDetails",
			},
		},
		{
			"$addFields": bson.M{
				"categoryDetails": bson.M{
					"$cond": bson.M{
						"if":   bson.M{"$ne": []interface{}{"$userCategoryDetails", bson.A{}}},
						"then": bson.M{"$arrayElemAt": []interface{}{"$userCategoryDetails", 0}},
						"else": bson.M{"$arrayElemAt": []interface{}{"$defaultCategoryDetails", 0}},
					},
				},
			},
		},
		{
			"$project": bson.M{
				"userCategoryDetails":    0,
				"defaultCategoryDetails": 0,
			},
		},
	}

	cursor, err := r.quizzesCollection.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	if err := cursor.All(ctx, &quizzes); err != nil {
		return nil, err
	}
	utils.Logger.WithField("quizzes", quizzes).Info("Quizzes retrieved successfully")
	return quizzes, nil
}

func (r *Repository) CountQuizzesByUser(userID string, categoryIDs []string) (int64, error) {
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return 0, err
	}

	filter := bson.M{"userId": objectID}

	if len(categoryIDs) > 0 {
		categoryObjectIDs := []primitive.ObjectID{}
		for _, id := range categoryIDs {
			if id == "" {
				continue
			}
			categoryObjectID, err := primitive.ObjectIDFromHex(id)
			if err != nil {
				return 0, err
			}
			categoryObjectIDs = append(categoryObjectIDs, categoryObjectID)
		}

		if len(categoryObjectIDs) > 0 {
			filter["categoryId"] = bson.M{"$in": categoryObjectIDs}
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	return r.quizzesCollection.CountDocuments(ctx, filter)
}

func (r *Repository) DeleteQuiz(userID primitive.ObjectID, quizID primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{
		"_id":    quizID,
		"userId": userID,
	}

	result, err := r.quizzesCollection.DeleteOne(ctx, filter)
	if err != nil {
		return err
	}

	if result.DeletedCount == 0 {
		return mongo.ErrNoDocuments
	}

	return nil
}
