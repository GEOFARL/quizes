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
	GetDefaultCategories() ([]models.Category, error)
}

type MongoRepository struct {
	userCategoriesCollection    *mongo.Collection
	defaultCategoriesCollection *mongo.Collection
}

func NewCategoryRepository(client *mongo.Client, dbName, userCollectionName, defaultCollectionName string) *MongoRepository {
	userCollection := client.Database(dbName).Collection(userCollectionName)
	defaultCollection := client.Database(dbName).Collection(defaultCollectionName)
	return &MongoRepository{
		userCategoriesCollection:    userCollection,
		defaultCategoriesCollection: defaultCollection,
	}
}

func (r *MongoRepository) IsCategoryNameDuplicate(userID primitive.ObjectID, name string) (bool, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	userFilter := bson.M{"userId": userID, "name": name}
	userCount, err := r.userCategoriesCollection.CountDocuments(ctx, userFilter)
	if err != nil {
		return false, err
	}

	defaultFilter := bson.M{"name": name}
	defaultCount, err := r.defaultCategoriesCollection.CountDocuments(ctx, defaultFilter)
	if err != nil {
		return false, err
	}

	return userCount > 0 || defaultCount > 0, nil
}

func (r *MongoRepository) SaveCategory(category *models.Category) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	category.CreatedAt = time.Now()
	_, err := r.userCategoriesCollection.InsertOne(ctx, category)
	return err
}

func (r *MongoRepository) GetCategoriesByUser(userID primitive.ObjectID) ([]models.Category, error) {
	var userCategories []models.Category
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{"userId": userID}
	cursor, err := r.userCategoriesCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	if err := cursor.All(ctx, &userCategories); err != nil {
		return nil, err
	}

	defaultCategories, err := r.GetDefaultCategories()
	if err != nil {
		return nil, err
	}

	return append(userCategories, defaultCategories...), nil
}

func (r *MongoRepository) GetCategoryByID(categoryID primitive.ObjectID) (*models.Category, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var category models.Category
	err := r.userCategoriesCollection.FindOne(ctx, bson.M{"_id": categoryID}).Decode(&category)
	if err != nil {
		return nil, err
	}

	return &category, nil
}

func (r *MongoRepository) GetDefaultCategories() ([]models.Category, error) {
	var defaultCategories []models.Category
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := r.defaultCategoriesCollection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}

	if err := cursor.All(ctx, &defaultCategories); err != nil {
		return nil, err
	}

	return defaultCategories, nil
}
