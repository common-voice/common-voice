# Fluentd module doesn't know how to handle parser filters yet
file { "/etc/td-agent/config.d/0-${project_name}-json.conf":
  ensure => present,
  owner   => 'root',
  group  => 'root',
  mode   => '0644',
  content => @(EOF)
# Possibly parse the message field as JSON formatted
<filter ec2.forward.systemd.journal>
  @type parser
  key_name message
  reserve_data true
  reserve_time true
  inject_key_prefix message.
  emit_invalid_record_to_error false
  <parse>
    @type json
  </parse>
</filter>
EOF 
}
