# Install dependencies

class { 'nodejs': 
  repo_url_suffix => '6.x',
}

package { 'gulp':
  ensure   => '3.9.1',
  provider => 'npm',
}

package { 'pm2':
  ensure   => '2.5.0',
  provider => 'npm',
}

package { 'libpq-dev':
  ensure => 'latest',
}

package { 'libmysqlclient-dev':
  ensure => 'latest',
}


# Build and Prep Node for service
exec { 'install deps':
  command => 'npm --verbose install',
  cwd     => "/var/www/$project_name",
  path    => [ '/bin', '/usr/bin', '/usr/local/bin' ],
  require => [
    Class['Nodejs'],
    Package['gulp'],
    Package['libpq-dev'],
  ],
}->
exec { 'build':
  command => 'gulp build',
  cwd     => "/var/www/$project_name",
  path    => [ '/bin', '/usr/bin', '/usr/local/bin' ],
  require => [
    Class['Nodejs'],
    Package['gulp'],
    Package['libpq-dev'],
  ],
}

include 'upstart'

upstart::job { $project_name:
    description    => 'Mozilla Common Voice',
    service_ensure => 'stopped',
    # Never give up
    respawn        => true,
    respawn_limit  => 'unlimited',
    start_on       => '(local-filesystems and net-device-up IFACE!=lo)',
    chdir          => "/var/www/$project_name",
    env            => {
      'HOME' => "/var/www/$project_name",
    },
    user           => 'root',
    group          => 'root',
    script         => '
  if [ -r /etc/profile.d/proxy.sh ]; then
    echo "Loading Proxy settings"
    . /etc/profile.d/proxy.sh
  fi

  exec /usr/bin/gulp listen
',
}
