package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Category struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    primitive.ObjectID `bson:"userId" json:"userId"`
	Name      string             `bson:"name" json:"name"`
	Color     string             `bson:"color" json:"color"`
	CreatedAt time.Time          `bson:"createdAt" json:"createdAt"`
}
