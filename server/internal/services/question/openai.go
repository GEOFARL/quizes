package question

import (
	"auth-service/internal/utils"
	"context"
	"encoding/json"
	"errors"
	"strings"

	openai "github.com/sashabaranov/go-openai"
)

type OpenAIClient interface {
	GenerateQuestions(prompt string) ([]Question, error)
}

type OpenAIService struct {
	client *openai.Client
}

func NewOpenAIService(apiKey string) *OpenAIService {
	client := openai.NewClient(apiKey)
	return &OpenAIService{client: client}
}

func (o *OpenAIService) GenerateQuestions(prompt string) ([]Question, error) {
	resp, err := o.client.CreateChatCompletion(context.Background(), openai.ChatCompletionRequest{
		Model: openai.GPT3Dot5Turbo,
		Messages: []openai.ChatCompletionMessage{
			{
				Role:    openai.ChatMessageRoleSystem,
				Content: "You are an assistant that generates structured questions from text.",
			},
			{
				Role:    openai.ChatMessageRoleUser,
				Content: prompt,
			},
		},
	})
	if err != nil {
		return nil, err
	}

	utils.Logger.Info("Raw OpenAI response: ", string(resp.Choices[0].Message.Content))

	if len(resp.Choices) == 0 {
		return nil, errors.New("no response from OpenAI")
	}

	cleanedResponse := cleanResponse(resp.Choices[0].Message.Content)

	var questions []Question
	err = json.Unmarshal([]byte(cleanedResponse), &questions)
	if err != nil {
		utils.Logger.WithError(err).WithField("response", resp.Choices[0].Message.Content).Error("Failed to unmarshal JSON")
		return nil, err
	}

	return questions, nil
}

func cleanResponse(response string) string {
	cleaned := strings.TrimSpace(response)
	cleaned = strings.TrimPrefix(cleaned, "```json")
	cleaned = strings.TrimSuffix(cleaned, "```")
	return strings.TrimSpace(cleaned)
}
