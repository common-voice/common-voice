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

resource "aws_iam_user" "bundler_bucket" {
  name = "${var.service_name}-${var.environment}-bundler_bucket"
  path = "/applicaton/${var.service_name}/"
}

resource "aws_iam_access_key" "bundler_bucket" {
  user = "${aws_iam_user.bundler_bucket.name}"
}

resource "aws_iam_user_policy" "bundler_bucket" {
  name = "bundler-bucket-access"
  user = "${aws_iam_user.bundler_bucket.name}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:*"
      ],
      "Resource": [
          "${module.bundler_bucket.arn}",
      "${module.bundler_bucket.arn}/*"
      ]
    }
  ]
}
EOF
}
