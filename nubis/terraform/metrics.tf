# Allows mozilla-itsre account to consume Cloudwatch metrics

resource "aws_iam_role" "cloudwatch_fetch_metrics" {
  name               = "cloudwatch_fetch_metrics"
  path               = "/itsre/"
  assume_role_policy = "${data.aws_iam_policy_document.allow_fetch_cloudwatch_metrics.json}"
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

  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"

    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::517826968395:root"]
    }
  }
}

