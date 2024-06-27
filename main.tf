terraform {
     required_providers {
        docker = {
            source = "kreuzwerker/docker" 
            version = "3.0.2" 
        } 
    }
}

provider "docker" {}

resource "docker_image" "allchataccounts" {
    name = "imeguras/allchataccounts:latest"
    keep_locally = false 
}

resource "docker_image" "allchatwsserver" {
    name = "imeguras/allchatwsserver:latest"
    keep_locally = false 
}

resource "docker_image" "allchatchatbackend" {
    name = "imeguras/allchatchatbackend:latest"
    keep_locally = false 
}

resource "docker_image" "allchatclientfrontend" {
    name = "imeguras/allchatclientfrontend:latest"
    keep_locally = false 
}

resource "docker_container" "allchataccounts" {
    image = docker_image.allchataccounts.image_id 
    name = "allchataccounts" 
    
    env = [
        "DATABASE_URL=${var.database_url_allchataccounts}",
        "GOOGLE_CLIENT_ID=${var.google_client_id}",
        "GOOGLE_CLIENT_SECRET=${var.google_client_secret}"
    ]

    ports {
        internal = 8000
        external = var.external_port_allchataccounts
    }
}

resource "docker_container" "allchatwsserver" {
    image = docker_image.allchatwsserver.image_id 
    name = "allchatwsserver" 
    
    ports {
        internal = 8001
        external = var.external_port_allchatwsserver
    }
}

resource "docker_container" "allchatchatbackend" {
    image = docker_image.allchatchatbackend.image_id 
    name = "allchatchatbackend" 
    
    env = [
        "DATABASE_URL=${var.database_url_allchatchatbackend}"
    ]

    ports {
        internal = 8002
        external = var.external_port_allchatchatbackend
    }
}

resource "docker_container" "allchatclientfrontend" {
    image = docker_image.allchatclientfrontend.image_id 
    name = "allchatclientfrontend" 
    
    env = [
        "GOOGLE_CLIENT_ID=${var.google_client_id}"
        "GOOGLE_CLIENT_SECRET=${var.google_client_secret}"
        "BACKEND_URL=${var.backend_url}"
        "WEBSOCKETS_URL=${var.websockets_url}"
        "CHAT_BACKEND_URL=${var.chat_backend_url}"
    ]

    ports {
        internal = 3000
        external = var.external_port_allchatclientfrontend
    }
}