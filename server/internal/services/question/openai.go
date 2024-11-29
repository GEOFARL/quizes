package question

import (
	"context"
	"encoding/json"
	"errors"

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
		Model: openai.GPT4,
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

	if len(resp.Choices) == 0 {
		return nil, errors.New("no response from OpenAI")
	}

	var questions []Question
	err = json.Unmarshal([]byte(resp.Choices[0].Message.Content), &questions)
	if err != nil {
		return nil, err
	}

	return questions, nil
}
