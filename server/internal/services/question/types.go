package question

type Question struct {
	ID             string   `json:"id"`
	Question       string   `json:"question"`
	Type           string   `json:"type"`
	Options        []string `json:"options,omitempty"`
	CorrectAnswers []string `json:"correctAnswers"`
}

type MockResponse struct {
	Questions []Question `json:"questions"`
}
