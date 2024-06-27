variable "external_port" {
    type = number
    description = "External port for the server"
    default = 0
}

variable "google_client_id" {
	type = string
	description = "Google client ID"
	default = " "
}
variable "google_client_secret" {
	type = string
	description = "Google client Secret"
	default = " "
}
variable "database_url" {
	type = string
	description = "Database URL"
	default = " "
}