package helpers

import (
	"auth-service/internal/context"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
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

func (tc *TestClient) DoMultipartRequest(
	method string,
	endpoint string,
	filePath string,
	fieldName string,
	body map[string]interface{},
) (*http.Response, map[string]interface{}, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, nil, err
	}
	defer file.Close()

	bodyBuffer := &bytes.Buffer{}
	writer := multipart.NewWriter(bodyBuffer)

	part, err := writer.CreateFormFile(fieldName, filepath.Base(filePath))
	if err != nil {
		return nil, nil, err
	}
	if _, err := io.Copy(part, file); err != nil {
		return nil, nil, err
	}

	for key, value := range body {
		if err := writer.WriteField(key, fmt.Sprintf("%v", value)); err != nil {
			return nil, nil, err
		}
	}

	writer.Close()

	req, err := http.NewRequest(method, tc.BaseURL+endpoint, bodyBuffer)
	if err != nil {
		return nil, nil, err
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())

	resp, err := tc.Client.Do(req)
	if err != nil {
		return nil, nil, err
	}
	defer resp.Body.Close()

	var respBody map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&respBody)
	return resp, respBody, err
}
