# Discover Consul settings
module "consul" {
  source       = "github.com/nubisproject/nubis-terraform//consul?ref=v2.2.0"
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
}
