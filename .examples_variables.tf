variable "external_port_allchataccounts" {
    type = number
    description = "External port for the allchataccounts server"
    default = 0
}

variable "external_port_allchatwsserver" {
    type = number
    description = "External port for the allchatwsserver server"
    default = '8001'
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