package question

import (
	"auth-service/internal/utils"
	"fmt"
	"strings"
)

type Service struct {
	openAI      OpenAIClient
	environment string
}

func New(openAI OpenAIClient, environment string) *Service {
	return &Service{openAI: openAI, environment: environment}
}

func (s *Service) GenerateQuestions(
	text string,
	numQuestions int,
	difficulty string,
	questionTypes []string,
	includeExplanations bool,
	locale string,
) ([]Question, error) {
	if s.environment == "development" {
		return GetMockQuestions(), nil
	}

	prompt := s.buildPrompt(text, numQuestions, difficulty, questionTypes, includeExplanations, locale)
	questions, err := s.openAI.GenerateQuestions(prompt)
	if err != nil {
		return nil, err
	}

	questions = validateQuestions(questions)

	if len(questions) < numQuestions {
		missingCount := numQuestions - len(questions)
		utils.Logger.Warn(fmt.Sprintf("warning: Only %d questions generated, %d missing.\n", len(questions), missingCount))
		additionalPrompt := fmt.Sprintf("Generate %d more questions based on the following text:\n%s", missingCount, text)
		moreQuestions, err := s.openAI.GenerateQuestions(additionalPrompt)
		if err == nil {
			questions = append(questions, validateQuestions(moreQuestions)...)
		}
	}

	if len(questions) < numQuestions {
		missingCount := numQuestions - len(questions)
		utils.Logger.Warn(fmt.Sprintf("Error: Could not generate %d questions. Filling with placeholders.\n", missingCount))
		for i := 0; i < missingCount; i++ {
			questions = append(questions, Question{
				ID:             fmt.Sprintf("placeholder-%d", i+1),
				Question:       "Placeholder question",
				Type:           "unknown",
				Options:        []string{},
				CorrectAnswers: []string{},
			})
		}
	}

	return questions[:numQuestions], nil
}

func (s *Service) buildPrompt(
	text string,
	numQuestions int,
	difficulty string,
	questionTypes []string,
	includeExplanations bool,
	locale string,
) string {
	typesDescription := "any type"
	if len(questionTypes) > 0 {
		typesDescription = strings.Join(questionTypes, ", ")
	}

	explanationClause := ""
	if includeExplanations {
		explanationClause = `
- explanation: (string, optional) Include an explanation field for each question that:
  - Justifies why the correct answer is correct.
  - Highlights related concepts or additional context from the text.
  - Avoids simply repeating the correct answer.`
	}

	return fmt.Sprintf(`
Generate exactly %d questions of the following types: %s, based on the provided text with a difficulty level of "%s".
The total number of questions must match the specified count, no more and no less.
The questions should be written in the language "%s", regardless of the language of the provided text.
Use clear and concise language, focusing on the key ideas in the text.
Ensure that at least one question of each specified type is included in the output.
- For "true-false" questions:
  - Ensure the question represents a factual statement that can clearly be evaluated as true or false.
  - Do not rephrase "true-false" questions to resemble multiple-choice questions.
  - The options array must contain exactly two items: the localized equivalents of "True" and "False."
  - Avoid ambiguous or comparative phrases in the question text.
- For "multiple-choice" questions:
  - Ensure there are at least two correct options, if applicable.
  - Do not include "True" or "False" as options.

The output should be a structured JSON format, with each question containing the following fields:
- id: A unique identifier (string)
- question: The question text (string)
- type: The type of the question ("%s")
- options: (array of strings, required for "single-choice" and "multiple-choice", leave empty for "true-false")
- correctAnswers: (array of strings, for "single-choice" include one correct answer; for "multiple-choice" include at least two correct answers)%s

Example JSON format:
[
  {
    "id": "1",
    "question": "What is the process of photosynthesis?",
    "type": "single-choice",
    "options": ["Respiration", "Photosynthesis", "Digestion", "Excretion"],
    "correctAnswers": ["Photosynthesis"]%s
  },
  {
    "id": "2",
    "question": "Photosynthesis occurs in chloroplasts.",
    "type": "true-false",
    "options": ["True", "False"],
    "correctAnswers": ["True"]%s
  }
]

Context:
%s`, numQuestions, typesDescription, difficulty, locale, strings.Join(questionTypes, `", "`), explanationClause,
		includeExplanationIfTrue(includeExplanations), includeExplanationIfTrue(includeExplanations), text)
}

func validateQuestions(questions []Question) []Question {
	for i, question := range questions {
		questions[i].Question = strings.ReplaceAll(question.Question, "(True/False)", "")
		questions[i].Question = strings.TrimSpace(questions[i].Question)
	}
	return questions
}
func includeExplanationIfTrue(includeExplanations bool) string {
	if includeExplanations {
		return `,"explanation": "Photosynthesis is the process by which plants use sunlight to synthesize food from carbon dioxide and water. It typically occurs in chloroplasts, which contain chlorophyll."`
	}
	return ""
}
