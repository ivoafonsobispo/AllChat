terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
    mongodbatlas = {
      source  = "mongodb/mongodbatlas"
      version = "~> 1.0"
    }
  }

  required_version = ">= 0.12"
}

provider "google" {
  project = "chat-app-419508"
  region  = "us-central1"
}

provider "mongodbatlas" {
  public_key  = "your_public_key"
  private_key = "your_private_key"
}

resource "google_container_cluster" "primary" {
  name     = "my-gke-cluster"
  location = "us-central1"

  initial_node_count = 3

  node_config {
    machine_type = "e2-medium"
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform",
    ]
  }
}

resource "google_container_node_pool" "primary_preemptible_nodes" {
  cluster    = google_container_cluster.primary.name
  node_count = 1

  node_config {
    preemptible  = true
    machine_type = "e2-medium"
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform",
    ]
  }

  location = google_container_cluster.primary.location
}

resource "mongodbatlas_cluster" "atlas_cluster" {
  project_id   = "your_project_id"
  name         = "my-mongo-cluster"
  cluster_type = "REPLICASET"

  provider_instance_size_name = "M10"
  provider_name               = "GCP"
  provider_region_name        = "US_CENTRAL"
}

resource "mongodbatlas_database_user" "chat_user" {
  project_id         = "your_project_id"
  username           = "chatuser"
  password           = "yourpassword"
  auth_database_name = "admin"
  roles {
    role_name     = "readWrite"
    database_name = "chatdb"
  }
}

resource "mongodbatlas_database" "chat_db" {
  project_id   = "your_project_id"
  cluster_name = mongodbatlas_cluster.atlas_cluster.name
  name         = "chatdb"
}

output "kubernetes_cluster_name" {
  value = google_container_cluster.primary.name
}
