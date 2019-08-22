exec { 'apt-get-update-grafana':
  command => '/usr/bin/apt-get update',
}->
class { 'grafana':
  install_method => 'repo',
  version        => '4.5.1',
  cfg            => {
    app_mode          => 'production',
    'server'          => {
      protocol => 'http',
      root_url => '/grafana',
    },
    'auth.anonymous'  => {
      enabled => true,
    },
    'auth.basic'      => {
      enabled => false,
    },
    'auth.proxy'      => {
      enabled         => true,
      header_name     => 'OIDC_CLAIM_email',
      header_property => 'email',
      auto_sign_up    => true,
    },
    users             => {
      allow_sign_up        => true,
      auto_assign_org      => true,
      auto_assign_org_role => 'Editor',
    },
    'dashboards.json' => {
      enabled => true,
    },
  },
}
->exec {'enable proxy support':
  command => '/bin/echo ". /etc/profile.d/proxy.sh" >> /etc/default/grafana-server'
}

file { '/etc/consul/svc-grafana.json':
    ensure => file,
    owner  => root,
    group  => root,
    mode   => '0644',
    source => 'puppet:///nubis/files/svc-grafana.json',
}
