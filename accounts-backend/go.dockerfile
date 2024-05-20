FROM golang:1.22.1

WORKDIR /app
COPY ./sql/Scheme.sql /Scheme.sql
COPY . .

RUN go mod download

RUN go build -o bin/accounts-backend ./cmd/api

EXPOSE 8000

CMD ["./bin/accounts-backend"]
