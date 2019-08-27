class { 'kibana':
  ensure 		=> latest,
  status		=> 'unmanaged',
  config               => {
    'server.basePath'   => '/kibana',
    'server.rewriteBasePath' => false,
  },
}

file { '/etc/consul/svc-kibana.json':
    ensure => file,
    owner  => root,
    group  => root,
    mode   => '0644',
    source => 'puppet:///nubis/files/svc-kibana.json',
}

file { '/etc/systemd/system/kibana.service':
    ensure => file,
    owner  => root,
    group  => root,
    mode   => '0644',
    source => 'puppet:///nubis/files/kibana.service',
    require => [
      Class['Kibana'],
    ],
}
