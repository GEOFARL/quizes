package helpers

import (
	"encoding/json"
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

func ValidateResponse(t *testing.T, expected, actual map[string]interface{}) {
	for key, expectedValue := range expected {
		actualValue, ok := actual[key]
		if !ok {
			t.Errorf("Key '%s' is missing in the actual response", key)
			continue
		}

		if expectedStr, ok := expectedValue.(string); ok && expectedStr == "<non_empty_string>" {
			assert.NotEmpty(t, actualValue, "Expected non-empty value for key '%s'", key)
		} else {
			assert.Equal(t, expectedValue, actualValue, "Mismatch for key: %s", key)
		}
	}

	if t.Failed() {
		expectedJSON, _ := json.MarshalIndent(expected, "", "  ")
		actualJSON, _ := json.MarshalIndent(actual, "", "  ")
		fmt.Printf("\nExpected Response:\n%s\n\nActual Response:\n%s\n", expectedJSON, actualJSON)
	}
}
