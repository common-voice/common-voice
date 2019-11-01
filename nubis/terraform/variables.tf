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

variable "technical_owner" {
  default = "infra-aws@mozilla.com"
}

variable "nubis_sudo_groups" {
  default = "nubis_global_admins,voice-dev"
}

variable "ami" {}

variable "read_only_public_users" {
  default = "100"
}

variable "bundler_read_only_public_users" {
  default = "1"
}

variable "metrics_user" {
  default     = "arn:aws:iam::177680776199:root"
  description = "ARN of the user/account fetching ELB metrics. Defaults to mozilla-itsre account"
}

variable "public_client_ip_cidr" {
  type = "list"

  default = [
    "174.92.145.133/32", #Gozer
    "18.140.218.113/32", #Can(SAP)
    "63.245.218.198/32", #Mozilla YVR office
    "63.245.212.198/32", #Mozilla YYZ office
    "134.41.190.137/32", #SRE-415
    "70.112.236.189/32", #SRE-415
    "77.66.65.31/32",    #SRE-415
    "77.66.65.32/32",    #SRE-415
  ]
}
