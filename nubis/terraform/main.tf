provider "aws" {
  region  = "${var.region}"
  version = "~> 1"
}

module "worker" {
  source        = "github.com/nubisproject/nubis-terraform//worker?ref=v2.3.1"
  region        = "${var.region}"
  environment   = "${var.environment}"
  account       = "${var.account}"
  service_name  = "${var.service_name}"
  purpose       = "webserver"
  ami           = "${var.ami}"
  elb           = "${module.load_balancer.name}"
  min_instances = 3
  max_instances = 30
  instance_type = "t2.medium"

  # Wait up to 10 minutes for warming up (in seconds)
  health_check_grace_period = "600"

  # Wait 12 minutes for nodes to be avaialble (in minutes)
  wait_for_capacity_timeout = "20m"

  nubis_sudo_groups = "${var.nubis_sudo_groups}"

  # CPU utilisation based autoscaling (with good defaults)
  scale_load_defaults = true
}

module "bundler" {
  source        = "github.com/nubisproject/nubis-terraform//worker?ref=v2.3.1"
  region        = "${var.region}"
  environment   = "${var.environment}"
  account       = "${var.account}"
  service_name  = "${var.service_name}"
  purpose       = "bundler"
  ami           = "${var.ami}"
  elb           = "${module.load_balancer.name}"
  min_instances = 1
  max_instances = 1
  instance_type = "t2.medium"

  root_storage_size = "128"

  # Wait up to 10 minutes for warming up (in seconds)
  health_check_grace_period = "600"

  # Wait 12 minutes for nodes to be avaialble (in minutes)
  wait_for_capacity_timeout = "20m"

  nubis_sudo_groups = "${var.nubis_sudo_groups}"

  # CPU utilisation based autoscaling (with good defaults)
  scale_load_defaults = false
}

module "load_balancer" {
  source       = "github.com/nubisproject/nubis-terraform//load_balancer?ref=6b91794839523ab5b3806824369efde2f61b3c17"
  region       = "${var.region}"
  environment  = "${var.environment}"
  account      = "${var.account}"
  service_name = "${var.service_name}"

  health_check_timeout             = 5
  health_check_healthy_threshold   = 3
  health_check_unhealthy_threshold = 3

  ssl_cert_name_prefix = "${var.service_name}"
}

module "dns" {
  source       = "github.com/nubisproject/nubis-terraform//dns?ref=v2.3.1"
  region       = "${var.region}"
  environment  = "${var.environment}"
  account      = "${var.account}"
  service_name = "${var.service_name}"
  target       = "${module.load_balancer.dualstack_address}"
}

resource "aws_db_parameter_group" "slow_query_enabled" {
  name   = "${var.service_name}-slow-query-${var.environment}-${var.region}"
  family = "mysql5.6"

  parameter {
    name         = "slow_query_log"
    value        = "1"
    apply_method = "immediate"
  }
}

module "database" {
  source                 = "github.com/nubisproject/nubis-terraform//database?ref=v2.3.1"
  region                 = "${var.region}"
  environment            = "${var.environment}"
  account                = "${var.account}"
  nubis_sudo_groups      = "${var.nubis_sudo_groups}"
  monitoring             = true
  service_name           = "${var.service_name}"
  client_security_groups = "${module.worker.security_group},${module.bundler.security_group}"
  parameter_group_name   = "${aws_db_parameter_group.slow_query_enabled.id}"
  instance_class         = "${var.environment == "prod" ? "db.t2.medium" : "db.t2.small"}"
}

module "clips" {
  #XXX: cors_rules will be added in Nubis v2.4.0
  source       = "github.com/gozer/nubis-terraform//bucket?ref=issue%2F249%2Fcors"
  region       = "${var.region}"
  environment  = "${var.environment}"
  account      = "${var.account}"
  service_name = "${var.service_name}"
  purpose      = "clips"
  role         = "${module.worker.role},${module.bundler.role}"
  role_cnt     = "2"

  cors_rules = [
    {
      allowed_headers = ["Authorization"]
      allowed_methods = ["GET"]
      allowed_origins = ["*"]
    },
  ]
}

module "bundler_bucket" {
  source       = "github.com/nubisproject/nubis-terraform//bucket?ref=v2.3.1"
  region       = "${var.region}"
  environment  = "${var.environment}"
  account      = "${var.account}"
  service_name = "${var.service_name}"
  purpose      = "bundler"
  role         = "${module.worker.role},${module.bundler.role}"
  role_cnt     = "2"
}

# Add elastic cache (memcache)
module "cache" {
  source                 = "github.com/nubisproject/nubis-terraform//cache?ref=v2.3.1"
  region                 = "${var.region}"
  environment            = "${var.environment}"
  account                = "${var.account}"
  service_name           = "${var.service_name}"
  client_security_groups = "${module.worker.security_group},${module.bundler.security_group}"
}
