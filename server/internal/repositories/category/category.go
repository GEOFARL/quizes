package category

import (
	"auth-service/internal/models"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Repository interface {
	SaveCategory(category *models.Category) error
	IsCategoryNameDuplicate(userID primitive.ObjectID, name string) (bool, error)
	GetCategoriesByUser(userID primitive.ObjectID) ([]models.Category, error)
	GetCategoryByID(categoryID primitive.ObjectID) (*models.Category, error)
}

type MongoRepository struct {
	collection *mongo.Collection
}

func NewCategoryRepository(client *mongo.Client, dbName, collectionName string) *MongoRepository {
	collection := client.Database(dbName).Collection(collectionName)
	return &MongoRepository{collection: collection}
}

func (r *MongoRepository) IsCategoryNameDuplicate(userID primitive.ObjectID, name string) (bool, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{"userId": userID, "name": name}
	count, err := r.collection.CountDocuments(ctx, filter)
	if err != nil {
		return false, err
	}

	return count > 0, nil
}

func (r *MongoRepository) SaveCategory(category *models.Category) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	category.CreatedAt = time.Now()
	_, err := r.collection.InsertOne(ctx, category)
	return err
}

func (r *MongoRepository) GetCategoriesByUser(userID primitive.ObjectID) ([]models.Category, error) {
	var categories []models.Category
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{"userId": userID}
	cursor, err := r.collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	if err := cursor.All(ctx, &categories); err != nil {
		return nil, err
	}

	return categories, nil
}

func (r *MongoRepository) GetCategoryByID(categoryID primitive.ObjectID) (*models.Category, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var category models.Category
	err := r.collection.FindOne(ctx, bson.M{"_id": categoryID}).Decode(&category)
	if err != nil {
		return nil, err
	}

	return &category, nil
}
