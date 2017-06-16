fluentd::configfile { $project_name: }

fluentd::source { 'node-output':
  configfile => $project_name,
  type       => 'tail',
  format     => 'none',

  tag        => 'forward.voice.node.stdout',
  config     => {
    'path'     => "/var/log/upstart/${project_name}.log",
    'pos_file' => "/var/log/upstart/${project_name}.pos",
  },
}
