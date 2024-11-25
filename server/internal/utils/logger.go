package utils

import (
	"os"

	"github.com/sirupsen/logrus"
)

var Logger *logrus.Logger

func InitializeLogger() {
	Logger = logrus.New()
	Logger.SetOutput(os.Stdout)
}
