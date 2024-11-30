package fileprocessor

import (
	"io"
	"strings"
)

type FileProcessor interface {
	Process(file io.Reader) (string, error)
}

func RegisterProcessors() map[string]FileProcessor {
	return map[string]FileProcessor{
		".txt": &TextProcessor{},
		".pdf": &PDFProcessor{},
	}
}

func GetFileExtension(filename string) string {
	if idx := strings.LastIndex(filename, "."); idx != -1 {
		return strings.ToLower(filename[idx:])
	}
	return ""
}
