package utils

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func ConnectDB(uri string) *mongo.Client {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		Logger.WithError(err).Fatal("Failed to connect to MongoDB")
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		Logger.WithError(err).Fatal("Failed to ping MongoDB")
	}

	Logger.Info("Connected to MongoDB")
	return client
}
