provider "aws" {
  region  = "${var.region}"
  version = "~> 1"
}

resource "aws_acm_certificate" "voice" {
  domain_name       = "${var.service_name}.${var.environment == "prod" ? "mozilla" : "allizom" }.org"
  validation_method = "EMAIL"
}

module "worker" {
  source        = "github.com/nubisproject/nubis-terraform//worker?ref=v2.4.0"
  region        = "${var.region}"
  environment   = "${var.environment}"
  account       = "${var.account}"
  service_name  = "${var.service_name}"
  purpose       = "webserver"
  ami           = "${var.ami}"
  elb           = "${module.load_balancer.name}"
  min_instances = "${var.environment == "prod" ? 5 : 3}"
  max_instances = 30
  instance_type = "t2.large"

  # Wait up to 10 minutes for warming up (in seconds)
  health_check_grace_period = "600"

  # Wait 12 minutes for nodes to be avaialble (in minutes)
  wait_for_capacity_timeout = "20m"

  nubis_sudo_groups = "${var.nubis_sudo_groups}"

  # CPU utilisation based autoscaling (with good defaults)
  scale_load_defaults = true
}

module "sync" {
  source            = "github.com/nubisproject/nubis-terraform//worker?ref=v2.4.0"
  region            = "${var.region}"
  environment       = "${var.environment}"
  account           = "${var.account}"
  service_name      = "${var.service_name}"
  purpose           = "sync"
  ami               = "${var.ami}"
  elb               = "${module.load_balancer.name}"
  min_instances     = "1"
  max_instances     = "1"
  instance_type     = "${var.environment == "prod" ? "t2.2xlarge" : "t2.small"}"
  root_storage_size = "${var.environment == "prod" ? "24" : "0"}"

  # Wait up to 10 minutes for warming up (in seconds)
  health_check_grace_period = "600"

  # Wait 12 minutes for nodes to be avaialble (in minutes)
  wait_for_capacity_timeout = "20m"

  nubis_sudo_groups = "${var.nubis_sudo_groups}"

  scale_load_defaults = false
}

module "load_balancer" {
  source       = "github.com/gozer/nubis-terraform//load_balancer?ref=issue%2F283%2Felb-acm"
  region       = "${var.region}"
  environment  = "${var.environment}"
  account      = "${var.account}"
  service_name = "${var.service_name}"

  health_check_target              = "HTTP:80/api/v1/metrics"
  health_check_timeout             = 5
  health_check_healthy_threshold   = 3
  health_check_unhealthy_threshold = 3

  ssl_cert_arn = "${aws_acm_certificate.voice.arn}"
}

module "dns" {
  source       = "github.com/nubisproject/nubis-terraform//dns?ref=v2.4.0"
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

  parameter {
    name         = "binlog_format"
    value        = "ROW"
    apply_method = "immediate"
  }
}

module "database" {
  source                 = "github.com/nubisproject/nubis-terraform//database?ref=v2.4.0"
  region                 = "${var.region}"
  environment            = "${var.environment}"
  account                = "${var.account}"
  nubis_sudo_groups      = "${var.nubis_sudo_groups}"
  monitoring             = true
  multi_az               = "${var.environment == "prod" ? true : false}"
  service_name           = "${var.service_name}"
  client_security_groups = "${module.worker.security_group},${module.sync.security_group}"
  parameter_group_name   = "${aws_db_parameter_group.slow_query_enabled.id}"
  instance_class         = "${var.environment == "prod" ? "db.m5.large" : "db.t2.small"}"
  allocated_storage      = "${var.environment == "prod" ? "100" : "32"}"
}

module "clips" {
  #XXX: cors_rules will be added in Nubis v2.4.0
  source       = "github.com/nubisproject/nubis-terraform//bucket?ref=v2.4.0"
  region       = "${var.region}"
  environment  = "${var.environment}"
  account      = "${var.account}"
  service_name = "${var.service_name}"
  purpose      = "clips"
  role_cnt     = "2"
  role         = "${module.worker.role},${module.sync.role}"

  cors_rules = [
    {
      allowed_headers = ["Authorization"]
      allowed_methods = ["GET"]
      allowed_origins = ["*"]
    },
  ]
}

module "bundler_bucket" {
  source       = "github.com/nubisproject/nubis-terraform//bucket?ref=v2.4.0"
  region       = "${var.region}"
  environment  = "${var.environment}"
  account      = "${var.account}"
  service_name = "${var.service_name}"
  purpose      = "bundler"
  role_cnt     = "2"
  role         = "${module.worker.role},${module.sync.role}"
}

# Add elastic cache (redis)
module "cache" {
  source                 = "github.com/nubisproject/nubis-terraform//cache?ref=v2.4.0"
  region                 = "${var.region}"
  environment            = "${var.environment}"
  account                = "${var.account}"
  service_name           = "${var.service_name}"
  client_security_groups = "${module.worker.security_group},${module.sync.security_group}"
  engine                 = "redis"
}

# External DB Replica
resource "aws_db_subnet_group" "public_database" {
  name        = "${var.service_name}-${var.environment}-public-rds-subnet-group"
  description = "${var.service_name}-${var.environment}-public-rds-subnet-group"

  subnet_ids = [
    "${split(",",module.info.public_subnets)}",
  ]

  tags {
    Region         = "${var.region}"
    Environment    = "${var.environment}"
    TechnicalOwner = "${var.technical_owner}"
    Backup         = "true"
    Shutdown       = "never"
  }
}

resource "aws_db_parameter_group" "public_database" {
  name   = "${var.service_name}-public-${var.environment}-${var.region}"
  family = "mysql5.6"
}

resource "aws_security_group" "public_database" {
  vpc_id = "${module.info.vpc_id}"
  name   = "${var.service_name}-${var.environment}-public-rds"

  tags = {
    Name           = "${var.service_name}-${var.environment}-public-rds"
    Region         = "${var.region}"
    Environment    = "${var.environment}"
    TechnicalOwner = "${var.technical_owner}"
    Backup         = "true"
    Shutdown       = "never"
  }

  ingress {
    from_port = "3306"
    to_port   = "3306"
    protocol  = "tcp"

    cidr_blocks = [
      "${var.public_client_ip_cidr}",
    ]

    security_groups = [
      "${module.worker.security_group}",
      "${module.sync.security_group}",
    ]
  }
}

data "aws_db_instance" "voice" {
  db_instance_identifier = "${var.service_name}-${var.environment}"
}

resource "aws_db_instance" "public" {
  identifier = "${var.service_name}-${var.environment}-public"

  #XXX:AWS API bug, needs ARN at creation, name at modification time
  #replicate_source_db = "${data.aws_db_instance.voice.db_instance_arn}"
  replicate_source_db = "${var.service_name}-${var.environment}"

  instance_class = "${var.environment == "prod" ? "db.t3.medium" : "db.t3.small"}"
  storage_type   = "standard"

  vpc_security_group_ids = [
    "${aws_security_group.public_database.id}",
  ]

  db_subnet_group_name = "${aws_db_subnet_group.public_database.id}"
  parameter_group_name = "${aws_db_parameter_group.public_database.id}"

  publicly_accessible = true
  apply_immediately   = true
  skip_final_snapshot = true

  tags {
    Region         = "${var.region}"
    Environment    = "${var.environment}"
    TechnicalOwner = "${var.technical_owner}"
  }
}

module "dns_public" {
  source       = "github.com/nubisproject/nubis-terraform//dns?ref=v2.4.0"
  region       = "${var.region}"
  environment  = "${var.environment}"
  account      = "${var.account}"
  service_name = "${var.service_name}"
  prefix       = "mysqldb"
  target       = "${aws_db_instance.public.address}"
}
