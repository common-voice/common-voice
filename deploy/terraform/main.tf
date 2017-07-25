module "worker" {
  source                    = "github.com/nubisproject/nubis-terraform//worker?ref=v1.5.0"
  region                    = "${var.region}"
  environment               = "${var.environment}"
  account                   = "${var.account}"
  service_name              = "${var.service_name}"
  purpose                   = "webserver"
  ami                       = "${var.ami}"
  elb                       = "${module.load_balancer.name}"
  min_instances             = 4
  max_instances             = 30

  # Wait up to 10 minutes for warming up (in seconds)
  health_check_grace_period = "600"
 
  # Wait 12 minutes for nodes to be avaialble (in minutes)
  wait_for_capacity_timeout = "20m"

  nubis_sudo_groups         = "team_webops,nubis_global_admins,voice-dev"
}

module "load_balancer" {
  source       = "github.com/nubisproject/nubis-terraform//load_balancer?ref=v1.5.0"
  region       = "${var.region}"
  environment  = "${var.environment}"
  account      = "${var.account}"
  service_name = "${var.service_name}"

  ssl_cert_name_prefix = "${var.service_name}"
}

module "dns" {
  source       = "github.com/nubisproject/nubis-terraform//dns?ref=v1.5.0"
  region       = "${var.region}"
  environment  = "${var.environment}"
  account      = "${var.account}"
  service_name = "${var.service_name}"
  target       = "${module.load_balancer.address}"
}

module "database" {
  source                 = "github.com/nubisproject/nubis-terraform//database?ref=v1.5.0"
  region                 = "${var.region}"
  environment            = "${var.environment}"
  account                = "${var.account}"
  monitoring             = true
  service_name           = "${var.service_name}"
  client_security_groups = "${module.worker.security_group}"
}

module "storage" {
  source                 = "github.com/nubisproject/nubis-terraform//storage?ref=v1.5.0"
  region                 = "${var.region}"
  environment            = "${var.environment}"
  account                = "${var.account}"
  service_name           = "${var.service_name}"
  storage_name           = "${var.service_name}"
  client_security_groups = "${module.worker.security_group}"
}

module "clips" {
  source       = "github.com/nubisproject/nubis-terraform//bucket?ref=v1.5.0"
  region       = "${var.region}"
  environment  = "${var.environment}"
  account      = "${var.account}"
  service_name = "${var.service_name}"
  purpose      = "clips"
  role         = "${module.worker.role}"
}
