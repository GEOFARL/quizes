package question

import (
	"auth-service/internal/utils"
	"encoding/json"
)

func GetMockQuestions() []Question {
	utils.Logger.Info("Using mock questions")
	mockData := `{
		"questions": [
			{
				"id": "1",
				"question": "When did the Industrial Revolution begin?",
				"type": "single-choice",
				"options": ["Late 16th century", "Late 17th century", "Late 18th century", "Late 19th century"],
				"correctAnswers": ["Late 18th century"]
			},
			{
				"id": "2",
				"question": "What marked a major turning point in history?",
				"type": "single-choice",
				"options": ["The Renaissance", "The French Revolution", "The Industrial Revolution", "The American Revolution"],
				"correctAnswers": ["The Industrial Revolution"]
			},
			{
				"id": "3",
				"question": "Which of the following were key innovations during the Industrial Revolution?",
				"type": "multiple-choice",
				"options": ["Steam engine", "Spinning jenny", "Power loom", "Telegraph"],
				"correctAnswers": ["Steam engine", "Spinning jenny", "Power loom"]
			},
			{
				"id": "4",
				"question": "Urbanization increased during the Industrial Revolution.",
				"type": "true-false",
				"options": ["true", "false"],
				"correctAnswers": ["true"]
			}
		]
	}`

	var mockResponse MockResponse
	err := json.Unmarshal([]byte(mockData), &mockResponse)
	if err != nil {
		utils.Logger.WithError(err).Error("Failed to unmarshal mock questions")
		return nil
	}

	return mockResponse.Questions
}
