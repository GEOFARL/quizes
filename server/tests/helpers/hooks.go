package helpers

import (
	testsuite "auth-service/tests/test_suite"
)

type Hook func(client *TestClient, testCase *testsuite.TestCase) error

var Hooks = map[string]Hook{
	"requiresAuth": func(client *TestClient, testCase *testsuite.TestCase) error {
		if testCase.Headers == nil {
			testCase.Headers = make(map[string]string)
		}
		testCase.Headers["Authorization"] = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzI2NTk4MDUsInVzZXJuYW1lIjoidGVzdHVzZXIifQ.9iZd6FSAtq3bN_vMHv9FMhdYnmhkXc-FdEiQIFVer_Q"
		return nil
	},
	"clearDatabase": func(client *TestClient, _ *testsuite.TestCase) error {
		return ClearDatabase(client.Context.DB, client.Context.Config.DBName)
	},
	"seedDatabase": func(client *TestClient, _ *testsuite.TestCase) error {
		return SeedTestDatabase(client.Context.DB, client.Context.Config.DBName)
	},
}
