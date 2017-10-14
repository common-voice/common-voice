# Install dependencies

class { 'nodejs':
  repo_url_suffix => '6.x',
}

package { 'gulp':
  ensure   => '3.9.1',
  provider => 'npm',
}

package { 'forever':
  ensure   => '0.15.3',
  provider => 'npm',
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

# Install service dependencies
exec { 'install deps':
  command => 'npm install --unsafe-perm',
  cwd     => "/var/www/${project_name}",
  path    => [ '/bin', '/usr/bin', '/usr/local/bin' ],
  require => [
    Class['Nodejs'],
    Package['gulp'],
    Package['libmysqlclient-dev'],
  ],
}

# Prepare Node for runtime, build assets and precompile
exec { 'build':
  command => 'gulp build',
  cwd     => "/var/www/${project_name}",
  path    => [ '/bin', '/usr/bin', '/usr/local/bin' ],
  require => [
    Class['Nodejs'],
    Package['gulp'],
    Package['libmysqlclient-dev'],
    Exec['install deps'],
  ],
}

# Create the service with upstart
include 'upstart'

upstart::job { $project_name:
    description    => 'Mozilla Common Voice',

    # let confd start us up
    service_ensure => 'stopped',
    service_enable => false,

    # Never give up
    respawn        => true,
    respawn_limit  => 'unlimited',
    start_on       => '(local-filesystems and net-device-up IFACE!=lo)',
    chdir          => "/var/www/${project_name}",
    env            => {
      'HOME' => "/var/www/${project_name}",
    },
    user           => "${project_name}-data",
    group          => "${project_name}-data",
    script         => "
  if [ -r /etc/profile.d/proxy.sh ]; then
    echo 'Loading Proxy settings'
    . /etc/profile.d/proxy.sh
  fi

  exec /usr/bin/forever --workingDir /var/www/${project_name} --minUptime 1000 --spinSleepTime 1000 /usr/bin/gulp run
",
}
