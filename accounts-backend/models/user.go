package models

type User struct {
	Id       int    `json:"id"`
	Name     string `json:"name"`
	Password string `json:"password"`
	Deleted  bool   `json:"deleted"`
}

type UserDTO struct {
	Name     string `json:"name"`
}