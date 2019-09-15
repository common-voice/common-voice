staging::file { 'aws-es-proxy':
  source => 'https://github.com/abutaha/aws-es-proxy/releases/download/v0.9/aws-es-proxy-0.9-linux-amd64',
  target => '/usr/local/bin/aws-es-proxy',
  owner  => 'root',
  group  => 'root',
  mode   => '0755',
}

systemd::unit_file { 'aws-es-proxy.service':
  source => 'puppet:///nubis/files/aws-es-proxy.systemd',
}
->service { 'aws-es-proxy':
  enable => true,
}

include mysql::client

# ES Mysql Sync Tool
staging::file { 'go-mysql-elasticsearch':
  source => 'https://github.com/gozer/go-mysql-elasticsearch/releases/download/test-rc1/go-mysql-elasticsearch',
  target => '/usr/local/bin/go-mysql-elasticsearch',
  owner  => 'root',
  group  => 'root',
  mode   => '0755',
}

systemd::unit_file { 'go-mysql-elasticsearch.service':
  source => 'puppet:///nubis/files/go-mysql-elasticsearch.systemd',
}
->service { 'go-mysql-elasticsearch':
  enable => false,
}
