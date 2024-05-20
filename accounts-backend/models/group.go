package models

type Group struct {
		Id       string  `json:"id"`
		Name     string `json:"name"`
		Deleted  bool   `json:"deleted"`
		Users    []UserDTO `json:"users"`
}
