package helpers

import (
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

		switch expectedVal := expectedValue.(type) {
		case string:
			if expectedVal == "<non_empty_string>" {
				assert.NotEmpty(t, actualValue, "Expected non-empty value for key '%s'", key)
			} else {
				assert.Equal(t, expectedVal, actualValue, "Mismatch for key: %s", key)
			}
		case []interface{}:
			expectedArr, ok := expectedValue.([]interface{})
			actualArr, ok2 := actualValue.([]interface{})
			assert.True(t, ok && ok2, "Expected and actual values for key '%s' must both be arrays", key)
			assert.GreaterOrEqual(t, len(actualArr), len(expectedArr), "Array length mismatch for key '%s'", key)
		default:
			assert.Equal(t, expectedValue, actualValue, "Mismatch for key: %s", key)
		}
	}
}
