module "info" {
  source      = "github.com/nubisproject/nubis-terraform//info?ref=v2.3.1"
  region      = "${var.region}"
  environment = "${var.environment}"
  account     = "${var.account}"
}

resource "aws_iam_service_linked_role" "es" {
  aws_service_name = "es.amazonaws.com"
}

resource "aws_security_group" "es" {
  name        = "${var.service_name}-${var.environment}-es"
  description = "Managed by Terraform"
  vpc_id      = "${module.info.vpc_id}"

  ingress {
    from_port = 443
    to_port   = 443
    protocol  = "tcp"

    security_groups = [
      "${module.worker.security_group}",
    ]
  }
}

resource "aws_elasticsearch_domain" "es" {
  domain_name           = "${var.service_name}-${var.environment}"
  elasticsearch_version = "7.1"

  cluster_config {
    instance_type          = "t2.medium.elasticsearch"
    instance_count         = 3
    zone_awareness_enabled = true

    zone_awareness_config {
      availability_zone_count = 3
    }
  }

  vpc_options {
    subnet_ids = [
      "${split(",",module.info.private_subnets)}",
    ]

    security_group_ids = ["${aws_security_group.es.id}"]
  }

  ebs_options {
    ebs_enabled = true
    volume_size = 32
  }

  advanced_options = {
    "rest.action.multi.allow_explicit_index" = "true"
  }

  snapshot_options {
    automated_snapshot_start_hour = 23
  }

  depends_on = [
    "aws_iam_service_linked_role.es",
  ]
}
