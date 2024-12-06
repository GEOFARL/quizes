package models

import (
	"auth-service/internal/services/question"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Quiz struct {
	ID         primitive.ObjectID  `bson:"_id,omitempty" json:"id"`
	UserID     primitive.ObjectID  `bson:"userId" json:"userId"`
	CategoryID primitive.ObjectID  `bson:"categoryId,omitempty" json:"categoryId,omitempty"`
	Name       string              `bson:"name" json:"name"`
	Questions  []question.Question `bson:"questions" json:"questions"`
	CreatedAt  time.Time           `bson:"createdAt" json:"createdAt"`
}
