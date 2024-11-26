package config

type Collections struct {
	Users string
}

func NewCollections() *Collections {
	return &Collections{
		Users: "users",
	}
}
