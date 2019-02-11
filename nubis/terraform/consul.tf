# Discover Consul settings
module "consul" {
  source       = "github.com/nubisproject/nubis-terraform//consul?ref=v2.3.1"
  region       = "${var.region}"
  environment  = "${var.environment}"
  account      = "${var.account}"
  service_name = "${var.service_name}"
}

# Configure our Consul provider, module can't do it for us
provider "consul" {
  address    = "${module.consul.address}"
  scheme     = "${module.consul.scheme}"
  datacenter = "${module.consul.datacenter}"
}

# Publish our outputs into Consul for our application to consume
resource "consul_keys" "config" {
  key {
    path   = "${module.consul.config_prefix}/Bucket/Bundler/Name"
    value  = "${module.bundler_bucket.name}"
    delete = true
  }

  key {
    path   = "${module.consul.config_prefix}/Bucket/Clips/Name"
    value  = "${module.clips.name}"
    delete = true
  }

  key {
    path   = "${module.consul.config_prefix}/Environment"
    value  = "${var.environment}"
    delete = true
  }

  key {
    path   = "${module.consul.config_prefix}/Bucket/Clips/Region"
    value  = "${var.region}"
    delete = true
  }

  key {
    path   = "${module.consul.config_prefix}/Bucket/Clips/Users/Read-Only/AccessKeyID"
    value  = "${aws_iam_access_key.clips_bucket.id}"
    delete = true
  }

  key {
    path   = "${module.consul.config_prefix}/Bucket/Clips/Users/Read-Only/SecretKey"
    value  = "${aws_iam_access_key.clips_bucket.secret}"
    delete = true
  }

  key {
    path   = "${module.consul.config_prefix}/Bucket/Bundler/Region"
    value  = "${var.region}"
    delete = true
  }

  key {
    path   = "${module.consul.config_prefix}/Bucket/Bundler/Users/Admin/AccessKeyID"
    value  = "${aws_iam_access_key.bundler_bucket.id}"
    delete = true
  }

  key {
    path   = "${module.consul.config_prefix}/Bucket/Bundler/Users/Admin/SecretKey"
    value  = "${aws_iam_access_key.bundler_bucket.secret}"
    delete = true
  }
}

# Publish our outputs into Consul for our application to consume
resource "consul_keys" "read_only_public_users" {
  count = "${var.read_only_public_users}"

  key {
    path   = "${module.consul.config_prefix}/Bucket/Clips/Users/Read-Only-Public/${format("%.3d", count.index)}/AccessKeyID"
    value  = "${element(aws_iam_access_key.clips_readonly.*.id, count.index)}"
    delete = true
  }

  key {
    path   = "${module.consul.config_prefix}/Bucket/Clips/Users/Read-Only-Public/${format("%.3d", count.index)}/SecretKey"
    value  = "${element(aws_iam_access_key.clips_readonly.*.secret, count.index)}"
    delete = true
  }
}

# Publish our outputs into Consul for our application to consume
resource "consul_keys" "bundler_read_only_public_users" {
  count = "${var.bundler_read_only_public_users}"

  key {
    path   = "${module.consul.config_prefix}/Bucket/Bundler/Users/Read-Only-Public/${format("%.3d", count.index)}/AccessKeyID"
    value  = "${element(aws_iam_access_key.bundler_readonly.*.id, count.index)}"
    delete = true
  }

  key {
    path   = "${module.consul.config_prefix}/Bucket/Bundler/Users/Read-Only-Public/${format("%.3d", count.index)}/SecretKey"
    value  = "${element(aws_iam_access_key.bundler_readonly.*.secret, count.index)}"
    delete = true
  }
}
