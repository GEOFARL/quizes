package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"`
	Email     string             `bson:"email"`
	Password  string             `bson:"password"`
	FullName  string             `bson:"fullName"`
	CreatedAt time.Time          `bson:"createdAt"`
}

func (u *User) ToTokenClaims() map[string]interface{} {
	return map[string]interface{}{
		"id":       u.ID.Hex(),
		"email":    u.Email,
		"fullName": u.FullName,
	}
}
