FROM golang:1.23 AS builder
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o /app/server ./cmd/server/app.go

FROM gcr.io/distroless/base-debian10 AS production
WORKDIR /app
COPY --from=builder /app/server /app/server
EXPOSE 8080
CMD ["/app/server"]

FROM golang:1.23 AS development
WORKDIR /app

RUN go install github.com/air-verse/air@latest

COPY . .
RUN go build -o /app/server ./cmd/server/app.go

EXPOSE 8080
CMD ["air"]
