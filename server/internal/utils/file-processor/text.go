package fileprocessor

import (
	"errors"
	"io"
)

type TextProcessor struct{}

func (p *TextProcessor) Process(file io.Reader) (string, error) {
	content, err := io.ReadAll(file)
	if err != nil {
		return "", errors.New("failed to read text file")
	}
	return string(content), nil
}
