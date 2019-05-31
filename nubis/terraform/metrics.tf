# Allows mozilla-itsre account to consume Cloudwatch metrics

resource "aws_iam_role" "cloudwatch_fetch_metrics" {
  name               = "cloudwatch_fetch_metrics-${var.environment}"
  path               = "/itsre/"
  assume_role_policy = "${data.aws_iam_policy_document.allow_assume_role.json}"
}

data "aws_iam_policy_document" "allow_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"

    principals {
      type        = "AWS"
      identifiers = ["${var.metrics_user}"]
    }
  }
}

resource "aws_iam_role_policy" "allow_fetch_cloudwatch_metrics" {
  name   = "allow_fetch_cloudwatch_metrics-${var.environment}"
  role   = "${aws_iam_role.cloudwatch_fetch_metrics.id}"
  policy = "${data.aws_iam_policy_document.allow_fetch_cloudwatch_metrics.json}"
}

data "aws_iam_policy_document" "allow_fetch_cloudwatch_metrics" {
  statement {
    actions = [
      "cloudwatch:Describe*",
      "cloudwatch:GetMetricData",
      "cloudwatch:GetMetricStatistics",
      "cloudwatch:ListMetrics",
    ]

    effect    = "Allow"
    resources = ["*"]
  }
}
