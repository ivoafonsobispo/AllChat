FROM golang:1.22.1

WORKDIR /app

COPY . .

RUN go mod download

RUN go build -o bin/chat-backend ./cmd/api
ENV DATABASE_URL ""
EXPOSE 8002

CMD ["./bin/chat-backend"]
