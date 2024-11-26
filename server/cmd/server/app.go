package main

import (
	"auth-service/internal/app"
	"auth-service/internal/context"
)

func main() {
	app := app.InitializeApp(context.NewContext())
	app.Run()
}
