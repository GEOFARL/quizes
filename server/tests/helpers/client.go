package helpers

import (
	"auth-service/config"
	"bytes"
	"encoding/json"
	"net/http"

	"go.mongodb.org/mongo-driver/mongo"
)

type TestClient struct {
	BaseURL string
	Client  *http.Client
	DB      *mongo.Client
	Config  *config.Config
}

func NewTestClient(baseURL string, db *mongo.Client, cfg *config.Config) *TestClient {
	return &TestClient{
		BaseURL: baseURL,
		Client:  &http.Client{},
		DB:      db,
		Config:  cfg,
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
