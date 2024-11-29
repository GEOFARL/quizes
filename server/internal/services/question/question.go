package question

import (
	"fmt"
)

type Service struct {
	openAI      OpenAIClient
	environment string
}

func New(openAI OpenAIClient, environment string) *Service {
	return &Service{openAI: openAI, environment: environment}
}

func (s *Service) GenerateQuestions(text string) ([]Question, error) {
	if s.environment == "development" {
		return GetMockQuestions(), nil
	}

	prompt := s.buildPrompt(text)
	return s.openAI.GenerateQuestions(prompt)
}

func (s *Service) buildPrompt(text string) string {
	return fmt.Sprintf(`
Generate a list of questions based on the following text in a structured JSON format. 
Each question should have the following fields:
- id: A unique identifier (string)
- question: The question text (string)
- type: The type of the question ("single-choice", "multiple-choice", "true-false")
- options: (array of strings, required for "single-choice" and "multiple-choice", leave empty for "true-false")
- correctAnswers: (array of strings, required for "multiple-choice" and "true-false" to specify correct answers, for "single-choice" only include one correct answer)

Example JSON format:
[
  {
    "id": "1",
    "question": "What is the process of photosynthesis?",
    "type": "single-choice",
    "options": ["Respiration", "Photosynthesis", "Digestion", "Excretion"],
    "correctAnswers": ["Photosynthesis"]
  },
  {
    "id": "2",
    "question": "Which of the following are required for photosynthesis?",
    "type": "multiple-choice",
    "options": ["Carbon dioxide", "Oxygen", "Water", "Glucose"],
    "correctAnswers": ["Carbon dioxide", "Water"]
  },
  {
    "id": "3",
    "question": "Photosynthesis occurs in chloroplasts.",
    "type": "true-false",
    "options": ["true", "false"],
    "correctAnswers": ["true"]
  }
]

Based on the text:
%s`, text)
}
