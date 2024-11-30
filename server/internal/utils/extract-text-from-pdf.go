package utils

import (
	"bytes"
	"fmt"
	"io"

	"github.com/unidoc/unidoc/pdf/extractor"
	"github.com/unidoc/unidoc/pdf/model"
)

func ExtractTextFromPDF(reader io.Reader) (string, error) {
	buf := &bytes.Buffer{}
	_, err := io.Copy(buf, reader)
	if err != nil {
		return "", fmt.Errorf("failed to read file content into buffer: %w", err)
	}

	pdfReader, err := model.NewPdfReader(bytes.NewReader(buf.Bytes()))
	if err != nil {
		return "", fmt.Errorf("failed to create PDF reader: %w", err)
	}

	numPages, err := pdfReader.GetNumPages()
	if err != nil {
		return "", fmt.Errorf("failed to get number of pages: %w", err)
	}

	var extractedText string
	for i := 1; i <= numPages; i++ {
		page, err := pdfReader.GetPage(i)
		if err != nil {
			return "", fmt.Errorf("failed to get page %d: %w", i, err)
		}

		pageExtractor, err := extractor.New(page)
		if err != nil {
			return "", fmt.Errorf("failed to create extractor for page %d: %w", i, err)
		}

		text, err := pageExtractor.ExtractText()
		if err != nil {
			return "", fmt.Errorf("failed to extract text from page %d: %w", i, err)
		}

		extractedText += text + "\n"
	}

	return extractedText, nil
}
