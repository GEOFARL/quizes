package config

type Collections struct {
	Users             string
	Quizzes           string
	Categories        string
	DefaultCategories string
}

func NewCollections() *Collections {
	return &Collections{
		Users:             "users",
		Quizzes:           "quizzes",
		Categories:        "categories",
		DefaultCategories: "defaultCategories",
	}
}
