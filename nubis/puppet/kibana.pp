class { 'kibana':
  ensure 		=> latest,
  status		=> 'unmanaged',
  config               => {
    'server.basePath'   => '/kibana',
  },
}

file { '/etc/consul/svc-kibana.json':
    ensure => file,
    owner  => root,
    group  => root,
    mode   => '0644',
    source => 'puppet:///nubis/files/svc-kibana.json',
}
