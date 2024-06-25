package models

type Group struct {
	Id      string    `json:"id"`
	Name    string    `json:"name"`
	Deleted bool      `json:"deleted"`
	IsDM    bool      `json:"is_pm_group"`
	Users   []UserDTO `json:"users"`
}

type GroupDTO struct {
	Id      string `json:"id"`
	Name    string `json:"name"`
	Deleted bool   `json:"deleted"`
	IsDM    bool   `json:"is_pm_group"`
}

type PMScomparator struct {
	Id_targ int `json:"id_targ"`
	Id_comp int `json:"id_comp"`
}
