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
		testCase.Headers["Authorization"] = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjIwNDg0MTk4NDksInVzZXIiOnsiZW1haWwiOiJhYmNkQGdtYWlsLmNvbSIsImZ1bGxOYW1lIjoiSm9obiBEb2UiLCJpZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCJ9fQ.3eDT6SkFgJzL4yFPdaPvI4jV0OE8QXE5qM6CDvGkUaE"
		return nil
	},
	"clearDatabase": func(client *TestClient, _ *testsuite.TestCase) error {
		return ClearDatabase(client.Context.DB, client.Context.Config.DBName)
	},
	"seedDatabase": func(client *TestClient, _ *testsuite.TestCase) error {
		return SeedTestDatabase(client.Context.DB, client.Context.Config.DBName)
	},
}
