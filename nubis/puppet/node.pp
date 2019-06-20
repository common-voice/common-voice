# Install dependencies

class { 'nodejs':
  repo_url_suffix => '8.x',
}

# Needed for binary compilation (i.e. bcrypt)s
package { 'node-gyp':
  ensure   => '3.6.2',
  provider => 'npm',
}

# Install mysql libraries
package { 'libmysqlclient-dev':
  ensure => 'latest',
}

# Install postgresql libraries
package { 'libpq-dev':
  ensure => 'latest',
}

# Install yarn
exec { 'install yarn':
  command   => 'npm install -g yarn',
  logoutput => true,
  cwd       => "/var/www/${project_name}",
  path      => [ '/bin', '/usr/bin', '/usr/local/bin' ],
  require   => [
    Class['Nodejs'],
  ],
}

# Install service dependencies
exec { 'install deps':
  command   => 'yarn',
  logoutput => true,
  cwd       => "/var/www/${project_name}",
  path      => [ '/bin', '/usr/bin', '/usr/local/bin' ],
  require   => [
    Class['Nodejs'],
    Package['libmysqlclient-dev'],
    Exec['install yarn'],
  ],
}

# Prepare Node for runtime, build assets and precompile
exec { 'build':
  command   => 'yarn build',
  logoutput => true,
  cwd       => "/var/www/${project_name}",
  path      => [ '/bin', '/usr/bin', '/usr/local/bin' ],
  require   => [
    Class['Nodejs'],
    Package['libmysqlclient-dev'],
    Exec['install deps'],
  ],
}

systemd::unit_file { "${project_name}.service":
  content => @("EOT")
[Unit]
Description=Mozilla Common Voice
Wants=basic.target
After=basic.target network.target

[Service]
Restart=on-failure
RestartSec=10s
User=${project_name}-data
Group=${project_name}-data
WorkingDirectory=/var/www/${project_name}

Environment=HOME=/var/www/${project_name}
EnvironmentFile=/var/www/${project_name}/newrelic.env

# Ensure logfile has proper permissions
PermissionsStartOnly=true

ExecStartPre=/bin/touch /var/log/voice.log
ExecStartPre=/bin/chown ${project_name}-data:${project_name}-data /var/log/voice.log

ExecStart=/bin/bash -c '. /etc/profile.d/proxy.sh && NO_PROXY=.s3.amazonaws.com,$NO_PROXY /usr/bin/yarn start:prod | tee >(/usr/bin/rotatelogs -t /var/log/voice.log 86400)'

[Install]
WantedBy=multi-user.target

EOT
} ~> service { $project_name:
  ensure => 'stopped',
  enable => true,
}

file { "/etc/nubis.d/${project_name}":
    ensure => file,
    owner  => root,
    group  => root,
    mode   => '0755',
    source => 'puppet:///nubis/files/startup',
}
