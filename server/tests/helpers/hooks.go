package helpers

import (
	testsuite "auth-service/tests/test_suite"
	"fmt"
)

type Hook func(client *TestClient, testCase *testsuite.TestCase) error

var Hooks = map[string]Hook{
	"requiresAuth": requiresAuthHook,
	"clearDatabase": func(client *TestClient, _ *testsuite.TestCase) error {
		return ClearDatabase(client.Context.DB, client.Context.Config.DBName)
	},
	"seedDatabase": func(client *TestClient, _ *testsuite.TestCase) error {
		return SeedTestDatabase(client.Context.DB, client.Context.Config.DBName)
	},
}

func requiresAuthHook(client *TestClient, testCase *testsuite.TestCase) error {
	loginBody := map[string]interface{}{
		"username": "testuser",
		"password": "password123",
	}

	resp, respBody, err := client.DoRequest("POST", "/login", loginBody, nil)
	if err != nil || resp.StatusCode != 200 {
		return fmt.Errorf("failed to authenticate: %v, response: %v", err, respBody)
	}

	token, ok := respBody["token"].(string)
	if !ok || token == "" {
		return fmt.Errorf("failed to extract token from login response: %v", respBody)
	}

	if testCase.Headers == nil {
		testCase.Headers = make(map[string]string)
	}
	testCase.Headers["Authorization"] = "Bearer " + token
	return nil
}
