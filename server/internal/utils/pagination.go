package utils

import (
	"strconv"

	"github.com/gin-gonic/gin"
)

type Pagination struct {
	Page  int `json:"page"`
	Limit int `json:"limit"`
	Skip  int `json:"-"`
	Total int `json:"total,omitempty"`
}

func NewPagination(page, limit int) Pagination {
	return Pagination{
		Page:  page,
		Limit: limit,
		Skip:  (page - 1) * limit,
	}
}

func GetPagination(c *gin.Context, defaultPage, defaultLimit int) (Pagination, error) {
	pageStr := c.DefaultQuery("page", strconv.Itoa(defaultPage))
	limitStr := c.DefaultQuery("limit", strconv.Itoa(defaultLimit))

	page, err := strconv.Atoi(pageStr)
	if err != nil || page <= 0 {
		return Pagination{}, gin.Error{Err: err, Type: gin.ErrorTypeBind, Meta: "Invalid page parameter"}
	}

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		return Pagination{}, gin.Error{Err: err, Type: gin.ErrorTypeBind, Meta: "Invalid limit parameter"}
	}

	return NewPagination(page, limit), nil
}
