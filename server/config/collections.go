package config

type Collections struct {
	Users   string
	Quizzes string
}

func NewCollections() *Collections {
	return &Collections{
		Users:   "users",
		Quizzes: "quizzes",
	}
}
