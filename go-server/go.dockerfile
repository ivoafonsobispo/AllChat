FROM golang:1.22.1

# Set the working directory inside the container
WORKDIR /app

# Copy the entire project directory into the container
COPY . .

# Download and install the dependencies specified in the go.mod file
RUN go mod download

# Build the Go binary from the cmd/api directory
RUN go build -o bin/go-server ./cmd/api

# Expose port 8000
EXPOSE 8000

# Run the executable
CMD ["./bin/go-server"]
