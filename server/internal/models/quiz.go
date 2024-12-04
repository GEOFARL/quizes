package models

import (
	"auth-service/internal/services/question"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Quiz struct {
	ID        primitive.ObjectID  `bson:"_id,omitempty"`
	UserID    primitive.ObjectID  `bson:"userId"`
	Name      string              `bson:"name"`
	Questions []question.Question `bson:"questions"`
	CreatedAt time.Time           `bson:"createdAt"`
}
