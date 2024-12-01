package helpers

import (
	"auth-service/internal/context"
	testsuite "auth-service/tests/test_suite"
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

func (tc *TestClient) DoMultipartRequest(testCase *testsuite.TestCase) (*http.Response, map[string]interface{}, error) {
	file, err := os.Open(testCase.File.Path)
	if err != nil {
		return nil, nil, err
	}
	defer file.Close()

	bodyBuffer := &bytes.Buffer{}
	writer := multipart.NewWriter(bodyBuffer)

	part, err := writer.CreateFormFile(testCase.File.Field, filepath.Base(testCase.File.Path))
	if err != nil {
		return nil, nil, err
	}
	_, err = io.Copy(part, file)
	if err != nil {
		return nil, nil, err
	}

	for key, value := range testCase.Body {
		if err := writer.WriteField(key, fmt.Sprintf("%v", value)); err != nil {
			return nil, nil, err
		}
	}

	writer.Close()

	req, err := http.NewRequest(testCase.Method, tc.BaseURL+testCase.Endpoint, bodyBuffer)
	if err != nil {
		return nil, nil, err
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())

	for key, val := range testCase.Headers {
		req.Header.Set(key, val)
	}

	resp, err := tc.Client.Do(req)
	if err != nil {
		return nil, nil, err
	}
	defer resp.Body.Close()

	var respBody map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&respBody)
	return resp, respBody, err
}
