FROM golang:1.22.1

WORKDIR /app

COPY . .

RUN go mod download

RUN go build -o bin/chat-backend ./cmd/ws

EXPOSE 8001

CMD ["./bin/chat-backend"]
