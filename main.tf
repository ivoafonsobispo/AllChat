terraform {
     required_providers {
        docker = {
            source = "kreuzwerker/docker" 
            version = "3.0.2" 
        } 
		google = {
			source = "hashicorp/google"
			version = "5.25.0"
		}
		
    }
}
provider "google" {
	project     = "mei-ipleiria-2024"
	//region      = "us-central1"
	//zone        = "us-central1-c"
}
//create postgres
resource "google_cloud_run_v2_service" "postgres" {
	name     = "postgres"
	location = "us-central1"
	ingress = "INGRESS_TRAFFIC_ALL"

	template {
		scaling {
		max_instance_count = 1
		}

		volumes {
			name = "postgres"
		}

		containers {
		image = "postgres:16-alpine"
			volume_mounts {
				name = "cloudsql"
				mount_path = "/cloudsql"
			}
			env{
				name = "POSTGRES_DB"
				value = "postgres"
				
			}
			env{
				name = "POSTGRES_USER"
				value = "admin"
			}
			env{
				name = "POSTGRES_PASSWORD"
				value = "admin"
			}
			ports {
				container_port = 5432
			}
		}
	}
	}

resource "google_cloud_run_v2_service" "allchataccounts" {
	name     = "allchataccounts"
	location = "us-central1"
	ingress = "INGRESS_TRAFFIC_ALL"
	
	template {
		containers {
			image = "imeguras/allchataccounts:latest"
			env {
				name = "DATABASE_URL"
				
				value = "${var.database_url_allchataccounts}"
			}
			env {
				name = "GOOGLE_CLIENT_ID"
				value = "${var.google_client_id}"
			}
			env {
				name = "GOOGLE_CLIENT_SECRET"
				value = "${var.google_client_secret}"
			}
			ports {
				container_port = 8000
			}

			
		}
		
	}
	depends_on = [google_cloud_run_v2_service.postgres]
}


resource "google_cloud_run_v2_service" "allchatwsserver" {
  name     = "allchatwsserver"
  location = "us-central1"
  ingress = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = "imeguras/allchatwsserver:latest"
		ports {
			container_port = 8001
		}
    }
	
  }
}
resource "google_cloud_run_v2_service" "allchatchatbackend" {
  name     = "allchatchatbackend"
  location = "us-central1"
  ingress = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = "imeguras/allchatchatbackend:latest"
	  env {
        name = "DATABASE_URL"
		value = "${var.database_url_allchatchatbackend}"
	  }
	  ports {
			container_port = 8002
		}
    }

  }
}
resource "google_cloud_run_v2_service" "allchatclientfrontend" {
  name     = "allchatclientfrontend"
  location = "us-central1"
  ingress = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
		image = "imeguras/allchatclientfrontend:latest"
			env {
				name = "GOOGLE_CLIENT_ID"
				value = "${var.google_client_id}"
			}
			env {
				name = "GOOGLE_CLIENT_SECRET"
				value = "${var.google_client_secret}"
			}
			env {
				name = "BACKEND_URL"
				value = "${var.backend_url}"
			}
			env {
				name = "WEBSOCKETS_URL"
				value = "${var.websockets_url}"
			}
			env {
				name = "CHAT_BACKEND_URL"
				value = "${var.chat_backend_url}"
			}
    	}
	}
}

resource "google_cloud_run_v2_service_iam_member" "allchataccounts_member" {
  project = google_cloud_run_v2_service.allchataccounts.project
  location = google_cloud_run_v2_service.allchataccounts.location
  name = google_cloud_run_v2_service.allchataccounts.name
  role = "roles/run.invoker"
  member = "allUsers"
  
}

resource "google_cloud_run_v2_service_iam_member" "allchatwsserver_member" {
  project = google_cloud_run_v2_service.allchatwsserver.project
  location = google_cloud_run_v2_service.allchatwsserver.location
  name = google_cloud_run_v2_service.allchatwsserver.name
  role = "roles/run.invoker"
  member = "allUsers"
  
}
resource "google_cloud_run_v2_service_iam_member" "allchatchatbackend_member" {
  project = google_cloud_run_v2_service.allchatchatbackend.project
  location = google_cloud_run_v2_service.allchatchatbackend.location
  name = google_cloud_run_v2_service.allchatchatbackend.name
  role = "roles/run.invoker"
  member = "allUsers"
  
}
resource "google_cloud_run_v2_service_iam_member" "allchatclientfrontend_member" {
  project = google_cloud_run_v2_service.allchatclientfrontend.project
  location = google_cloud_run_v2_service.allchatclientfrontend.location
  name = google_cloud_run_v2_service.allchatclientfrontend.name
  role = "roles/run.invoker"
  member = "allUsers"
  
}
resource "google_sql_database_instance" "postgres_member" {
name             = "cloudrun-sql"
  region           = "us-east1"
  database_version = "POSTGRES_16"
  settings {
    tier = "db-f1-micro"
  }
  
}












/**





resource "docker_container" "allchatclientfrontend" {
    image = docker_image.allchatclientfrontend.image_id 
    name = "allchatclientfrontend" 
    
    env = [
        "GOOGLE_CLIENT_ID=${var.google_client_id}",
        "GOOGLE_CLIENT_SECRET=${var.google_client_secret}",
        "BACKEND_URL=${var.backend_url}",
        "WEBSOCKETS_URL=${var.websockets_url}",
        "CHAT_BACKEND_URL=${var.chat_backend_url}"
    ]

    ports {
        internal = 3000
        external = var.external_port_allchatclientfrontend
    }
}

***/