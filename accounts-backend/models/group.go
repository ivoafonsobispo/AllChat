package models

type Group struct {
	Id      string    `json:"id"`
	Name    string    `json:"name"`
	Deleted bool      `json:"deleted"`
	IsDM    bool      `json:"is_pm_group"`
	Users   []UserDTO `json:"users"`
}
type FixGroup struct {
	Id      string   `json:"id"`
	Name    string   `json:"name"`
	Deleted bool     `json:"deleted"`
	IsDM    bool     `json:"is_pm_group"`
	Users   []string `json:"users"`
}
type GroupDTO struct {
	Id      string `json:"id"`
	Name    string `json:"name"`
	Deleted bool   `json:"deleted"`
	IsDM    bool   `json:"is_pm_group"`
}

type PMScomparator struct {
	Id_targ []string `json:"id_targ"`
}
