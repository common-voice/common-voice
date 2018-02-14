fluentd::configfile { $project_name: }

fluentd::source { 'node-output':
  configfile  => $project_name,
  type        => 'tail',
  format      => 'json',
  time_format => '%Y-%m-%dT%H:%M:%S.%L%Z',

  tag         => 'forward.voice.node.stdout',
  config      => {
    'read_from_head' => true,
    'path'           => "/var/log/upstart/${project_name}.log",
    'pos_file'       => "/var/log/upstart/${project_name}.pos",
  },
}

# Workaround for https://github.com/fluent/fluentd/issues/1734
# restart td-agent after log rotation
file { '/etc/logrotate.d/upstart':
  ensure => file,
  owner  => root,
  group  => root,
  mode   => '0644',
  source => 'puppet:///nubis/files/upstart.logrotate',
}
