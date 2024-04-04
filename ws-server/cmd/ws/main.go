package main

import (
	"ws/server"
)

func main() {
	s := server.NewServer()

	s.Start()
}
