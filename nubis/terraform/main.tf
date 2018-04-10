module "worker" {
  source        = "github.com/nubisproject/nubis-terraform//worker?ref=v2.2.0"
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

module "load_balancer" {
  source       = "github.com/nubisproject/nubis-terraform//load_balancer?ref=v2.2.0"
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
  source       = "github.com/nubisproject/nubis-terraform//dns?ref=v2.2.0"
  region       = "${var.region}"
  environment  = "${var.environment}"
  account      = "${var.account}"
  service_name = "${var.service_name}"
  target       = "${module.load_balancer.address}"
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
  source                 = "github.com/nubisproject/nubis-terraform//database?ref=v2.2.0"
  region                 = "${var.region}"
  environment            = "${var.environment}"
  account                = "${var.account}"
  nubis_sudo_groups      = "${var.nubis_sudo_groups}"
  monitoring             = true
  service_name           = "${var.service_name}"
  client_security_groups = "${module.worker.security_group}"
  parameter_group_name   = "${aws_db_parameter_group.slow_query_enabled.id}"
  instance_class         = "db.t2.small"
}

module "clips" {
  source       = "github.com/nubisproject/nubis-terraform//bucket?ref=v2.2.0"
  region       = "${var.region}"
  environment  = "${var.environment}"
  account      = "${var.account}"
  service_name = "${var.service_name}"
  purpose      = "clips"
  role         = "${module.worker.role}"
}
