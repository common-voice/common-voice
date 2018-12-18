resource "aws_iam_user" "clips_readonly" {
  count = "${var.read_only_public_users}"
  name  = "${var.service_name}-${var.environment}-clips-readonly-${format("%.3d", count.index)}"
  path  = "/applicaton/${var.service_name}/"
}

resource "aws_iam_access_key" "clips_readonly" {
  count = "${var.read_only_public_users}"
  user  = "${element(aws_iam_user.clips_readonly.*.name, count.index)}"
}

resource "aws_iam_user_policy" "clips_readonly" {
  name = "clips-readonly-access"
  user = "${element(aws_iam_user.clips_readonly.*.name, count.index)}"

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
