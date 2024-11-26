package helpers

import (
	"auth-service/internal/context"
	"bytes"
	"encoding/json"
	"net/http"
)

type TestClient struct {
	BaseURL string
	Client  *http.Client
	Context *context.Context
}

func NewTestClient(baseURL string, ctx *context.Context) *TestClient {
	return &TestClient{
		BaseURL: baseURL,
		Client:  &http.Client{},
		Context: ctx,
	}
}

func (tc *TestClient) DoRequest(method, endpoint string, body map[string]interface{}, headers map[string]string) (*http.Response, map[string]interface{}, error) {
	var reqBody []byte
	if body != nil {
		reqBody, _ = json.Marshal(body)
	}

	req, err := http.NewRequest(method, tc.BaseURL+endpoint, bytes.NewBuffer(reqBody))
	if err != nil {
		return nil, nil, err
	}

	for key, value := range headers {
		req.Header.Set(key, value)
	}

	resp, err := tc.Client.Do(req)
	if err != nil {
		return nil, nil, err
	}
	defer resp.Body.Close()

	var respBody map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&respBody)

	return resp, respBody, nil
}
