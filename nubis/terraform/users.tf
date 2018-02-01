provider "aws" {
  region = "${var.region}"
}

resource "aws_iam_user" "clips_bucket" {
  name = "${var.service_name}-${var.environment}-clips_bucket"
  path = "/applicaton/${var.service_name}/"
}

resource "aws_iam_access_key" "clips_bucket" {
  user = "${aws_iam_user.clips_bucket.name}"
}

resource "aws_iam_user_policy" "clips_bucket" {
  name = "clips-bucket-access"
  user = "${aws_iam_user.clips_bucket.name}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
          "${module.clips.arn}",
      "${module.clips.arn}/*"
      ]
    }
  ]
}
EOF
}

resource "aws_db_parameter_group" "default" {
  name   = "cv-parameter-group"
  family = "mysql5.6"

  parameter {
    name  = "slow_query_log"
    value = "1"
  }
}
