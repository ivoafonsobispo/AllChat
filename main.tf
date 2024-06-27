terraform {
     required_providers {
        docker = {
            source = "kreuzwerker/docker" 
            version = "3.0.2" 
        } 
    }
}

provider "docker" {
	host = "unix:///var/run/docker.sock"
}

resource "docker_image" "allchataccounts" {
    name = "imeguras/allchataccounts:latest"
    keep_locally = false 
}

resource "docker_container" "allchataccounts" {
    image = docker_image.allchataccounts.image_id 
    name = "allchataccounts" 
    
     env = [
        "DATABASE_URL=${var.database_url}",
        "GOOGLE_CLIENT_ID=${var.google_client_id}",
        "GOOGLE_CLIENT_SECRET=${var.google_client_secret}"
    ]


    ports {
        internal = 8000
        external = var.external_port
    }
}