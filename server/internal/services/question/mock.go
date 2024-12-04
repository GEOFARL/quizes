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
				"question": "What is JSON?",
				"type": "single-choice",
				"options": [
					"A data interchange format",
					"A programming language",
					"An audio format",
					"A video format"
				],
				"correctAnswers": [
					"A data interchange format"
				],
				"explanation": "JSON is a data interchange format used to store and transmit data with name-value pairs and arrays."
			},
			{
				"id": "2",
				"question": "Is JSON a language-dependent data format?",
				"type": "true-false",
				"options": [
					"True",
					"False"
				],
				"correctAnswers": [
					"False"
				],
				"explanation": "JSON is a language-independent data format, not tied to any specific programming language."
			},
			{
				"id": "3",
				"question": "Who specified the JSON format?",
				"type": "single-choice",
				"options": [
					"Chip Morningstar",
					"Douglas Crockford",
					"Jason and The Argonauts",
					"ECMA-404"
				],
				"correctAnswers": [
					"Douglas Crockford"
				],
				"explanation": "Douglas Crockford originally specified the JSON format in the early 2000s."
			},
			{
				"id": "4",
				"question": "When was the first JSON message sent?",
				"type": "single-choice",
				"options": [
					"2006",
					"2011",
					"2013",
					"2001"
				],
				"correctAnswers": [
					"2001"
				],
				"explanation": "The first JSON message was sent in April 2001 by Douglas Crockford and Chip Morningstar."
			},
			{
				"id": "5",
				"question": "JSON uses human-readable text to store data. Is this statement true or false?",
				"type": "true-false",
				"options": [
					"True",
					"False"
				],
				"correctAnswers": [
					"True"
				],
				"explanation": "JSON is a human-readable text format used to store and transmit data objects."
			},
			{
				"id": "6",
				"question": "Which standard specifies the pronunciation of 'JSON'?",
				"type": "single-choice",
				"options": [
					"ISO/IEC 21778:2017",
					"ECMA-404",
					"RFC 4627",
					"ECMA-404 and ISO/IEC 21778:2017"
				],
				"correctAnswers": [
					"ECMA-404 and ISO/IEC 21778:2017"
				],
				"explanation": "The 2017 international standard specifies that 'JSON' is pronounced as /ˈdʒeɪ.sən/."
			},
			{
				"id": "7",
				"question": "Is JSON only used in web applications with servers?",
				"type": "true-false",
				"options": [
					"True",
					"False"
				],
				"correctAnswers": [
					"False"
				],
				"explanation": "JSON has diverse uses in electronic data interchange beyond just web applications with servers."
			},
			{
				"id": "8",
				"question": "Which year saw the standardization of JSON as ISO/IEC 21778:2017?",
				"type": "single-choice",
				"options": [
					"2013",
					"2006",
					"2011",
					"2017"
				],
				"correctAnswers": [
					"2017"
				],
				"explanation": "JSON was standardized as ISO/IEC 21778:2017 in that year."
			},
			{
				"id": "9",
				"question": "Does JSON include code to parse data in modern programming languages?",
				"type": "true-false",
				"options": [
					"True",
					"False"
				],
				"correctAnswers": [
					"True"
				],
				"explanation": "Many modern programming languages include code to parse JSON-format data."
			},
			{
				"id": "10",
				"question": "Which individual sent the first JSON message?",
				"type": "single-choice",
				"options": [
					"Douglas Crockford",
					"Chip Morningstar",
					"Jason and The Argonauts",
					"ECMA-404"
				],
				"correctAnswers": [
					"Douglas Crockford"
				],
				"explanation": "Douglas Crockford and Chip Morningstar sent the first JSON message in April 2001."
			}
		]
	}`

	var mockResponse struct {
		Questions []Question `json:"questions"`
	}
	err := json.Unmarshal([]byte(mockData), &mockResponse)
	if err != nil {
		utils.Logger.WithError(err).Error("Failed to unmarshal mock questions")
		return nil
	}

	return mockResponse.Questions
}
