output "address" {
  value = "https://${module.dns.fqdn}/"
}

output "iam_role_arn" {
  value       = "${aws_iam_role.cloudwatch_fetch_metrics.arn}"
  description = "ARN of the user allowed to fetch metrics."
}
