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
