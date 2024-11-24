package helpers

import (
	"context"
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

func SeedTestDatabase(db *mongo.Client, dbName string) error {
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)

	seedData := []SeedData{
		{
			Collection: "users",
			Documents: []map[string]interface{}{
				{"username": "testuser", "password": string(hashedPassword)},
				{"username": "anotheruser", "password": string(hashedPassword)},
			},
		},
	}

	return seedDatabase(db, dbName, seedData)
}

func ClearDatabase(db *mongo.Client, dbName string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	return db.Database(dbName).Drop(ctx)
}
