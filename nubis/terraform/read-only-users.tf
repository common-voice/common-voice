resource "aws_iam_user" "clips_readonly" {
  name = "${var.service_name}-${var.environment}-clips_readonly"
  path = "/applicaton/${var.service_name}/"
}

resource "aws_iam_access_key" "clips_readonly" {
  count = "${var.read_only_public_users}"
  user  = "${aws_iam_user.clips_readonly.name}"
}

resource "aws_iam_user_policy" "clips_readonly" {
  name = "clips-readonly-access"
  user = "${aws_iam_user.clips_readonly.name}"

  policy = "${data.aws_iam_policy_document.clips_readonly.json}"
}

data "aws_iam_policy_document" "clips_readonly" {
  statement {
    sid = "readonly"

    actions = [
      "s3:GetObject",
      "s3:ListBucket",
    ]

    resources = [
      "${module.clips.arn}",
      "${module.clips.arn}/*",
    ]
  }
}
