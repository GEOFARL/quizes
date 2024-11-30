package fileprocessor

import (
	"auth-service/internal/utils"
	"io"
)

type PDFProcessor struct{}

func (p *PDFProcessor) Process(file io.Reader) (string, error) {
	return utils.ExtractTextFromPDF(file)
}
