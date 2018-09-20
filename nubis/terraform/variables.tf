variable "account" {
  default = ""
}

variable "region" {
  default = "us-west-2"
}

variable "environment" {
  default = "stage"
}

variable "service_name" {
  default = "voice"
}

variable "nubis_sudo_groups" {
  default = "nubis_global_admins,voice-dev"
}

variable "ami" {}
