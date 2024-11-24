package testsuite

type Suite struct {
	Tests []TestCase `yaml:"tests"`
}

type TestCase struct {
	Name             string                 `yaml:"name"`
	Method           string                 `yaml:"method"`
	Endpoint         string                 `yaml:"endpoint"`
	Headers          map[string]string      `yaml:"headers"`
	Body             map[string]interface{} `yaml:"body"`
	ExpectedStatus   int                    `yaml:"expected_status"`
	ExpectedResponse map[string]interface{} `yaml:"expected_response"`
	PreHooks         []string               `yaml:"pre_hooks"`
	PostHooks        []string               `yaml:"post_hooks"`
}
