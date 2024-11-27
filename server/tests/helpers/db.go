package helpers

import (
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

type SeedData struct {
	Collection string
	Documents  []map[string]interface{}
}

func seedDatabase(db *mongo.Client, dbName string, seedData []SeedData) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	for _, data := range seedData {
		collection := db.Database(dbName).Collection(data.Collection)
		if len(data.Documents) > 0 {
			var documents []interface{}
			for _, doc := range data.Documents {
				documents = append(documents, doc)
			}
			_, err := collection.InsertMany(ctx, documents)
			if err != nil {
				return err
			}
		}
	}
	return nil
}

func SeedTestDatabase(db interface{}, dbName string) error {
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)

	seedData := []SeedData{
		{
			Collection: "users",
			Documents: []map[string]interface{}{
				{"email": "test@gmail.com", "password": string(hashedPassword), "fullName": "John Doe"},
				{"email": "another@gmail.com", "password": string(hashedPassword), "fullName": "Jane Doe"},
			},
		},
	}

	dbClient, ok := db.(*mongo.Client)
	if !ok {
		return errors.New("invalid MongoDB client")
	}

	return seedDatabase(dbClient, dbName, seedData)
}

func ClearDatabase(db interface{}, dbName string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	dbClient, ok := db.(*mongo.Client)
	if !ok {
		return errors.New("invalid MongoDB client")
	}
	return dbClient.Database(dbName).Drop(ctx)
}
