package tests

import (
	"auth-service/internal/app"
	"auth-service/tests/helpers"
	testsuite "auth-service/tests/test_suite"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
	"gopkg.in/yaml.v3"
)

func TestYAMLTests(t *testing.T) {
	ctx := NewTestContext()
	app := app.InitializeApp(ctx)
	ts := httptest.NewServer(app.Router)
	defer ts.Close()

	client := helpers.NewTestClient(ts.URL, ctx)

	cwd, _ := os.Getwd()
	apiTestsPath := filepath.Join(cwd, "api_tests")

	files, err := os.ReadDir(apiTestsPath)
	if err != nil {
		t.Fatalf("Failed to read test files: %v", err)
	}

	for _, file := range files {
		filePath := filepath.Join(apiTestsPath, file.Name())
		t.Run(file.Name(), func(t *testing.T) {
			runTestSuite(t, client, filePath)
		})
	}
}

func runTestSuite(t *testing.T, client *helpers.TestClient, filePath string) {
	suite, err := loadTestSuite(filePath)
	if err != nil {
		t.Fatalf("Failed to load test suite: %v", err)
	}

	for _, testCase := range suite.Tests {
		t.Run(testCase.Name, func(t *testing.T) {
			for _, hookName := range testCase.PreHooks {
				if hook, exists := helpers.Hooks[hookName]; exists {
					if err := hook(client, &testCase); err != nil {
						t.Fatalf("Pre-hook '%s' failed: %v", hookName, err)
					}
				} else {
					t.Fatalf("Unknown pre-hook: '%s'", hookName)
				}
			}

			resp, respBody, err := client.DoRequest(testCase.Method, testCase.Endpoint, testCase.Body, testCase.Headers)
			if err != nil {
				t.Fatalf("Failed to execute request: %v", err)
			}

			assert.Equal(t, testCase.ExpectedStatus, resp.StatusCode, "Status code mismatch for test: %s", testCase.Name)
			helpers.ValidateResponse(t, testCase.ExpectedResponse, respBody)

			for _, hookName := range testCase.PostHooks {
				if hook, exists := helpers.Hooks[hookName]; exists {
					if err := hook(client, &testCase); err != nil {
						t.Fatalf("Post-hook '%s' failed: %v", hookName, err)
					}
				} else {
					t.Fatalf("Unknown post-hook: '%s'", hookName)
				}
			}
		})
	}
}

func loadTestSuite(filePath string) (*testsuite.Suite, error) {
	data, err := os.ReadFile(filePath)
	if err != nil {
		return nil, err
	}

	var suite testsuite.Suite
	err = yaml.Unmarshal(data, &suite)
	return &suite, err
}
