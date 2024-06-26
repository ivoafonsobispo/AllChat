provider "google" {
  project = "your-gcp-project-id"
  region  = "us-central1"
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

resource "google_sql_database_instance" "postgres_instance" {
  name             = "postgres-instance"
  database_version = "POSTGRES_12"
  region           = "us-central1"

  settings {
    tier = "db-f1-micro"
  }
}

resource "google_sql_database" "chat_db" {
  name     = "chatdb"
  instance = google_sql_database_instance.postgres_instance.name
}

resource "google_sql_user" "chat_user" {
  name     = "chatuser"
  instance = google_sql_database_instance.postgres_instance.name
  password = "yourpassword"
}

output "kubernetes_cluster_name" {
  value = google_container_cluster.primary.name
}
