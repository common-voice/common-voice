fluentd::configfile { $project_name: }

fluentd::source { 'node-output':
  configfile  => $project_name,
  type        => 'tail',
  format      => 'json',
  time_format => '%Y-%m-%dT%H:%M:%S.%L%Z',

  tag         => 'forward.voice.node.stdout',
  config      => {
    'path'     => "/var/log/upstart/${project_name}.log",
    'pos_file' => "/var/log/upstart/${project_name}.pos",
  },
}
