$virtualenv_path = '/usr/local/virtualenvs'

vcsrepo { '/opt/common-voice-bundler':
  ensure   => present,
  provider => 'git',
  source   => 'https://github.com/Common-Voice/common-voice-bundler.git',
  revision => 'b1bdc7990e9bda7833c3776f2416d3ec7ec292a5',
}
  -> exec { 'install common-voice-bundler deps':
  command   => 'yarn',
  logoutput => true,
  cwd       => '/opt/common-voice-bundler',
  path      => [ '/bin', '/usr/bin', '/usr/local/bin' ],
  require   => [
    Class['Nodejs'],
    Exec['install yarn'],
  ],
}

file { '/usr/local/bin/voice-bundler':
    ensure => file,
    owner  => root,
    group  => root,
    mode   => '0755',
    source => 'puppet:///nubis/files/bundler',
}

file { '/opt/common-voice-bundler/out':
  ensure  => 'directory',
  owner   => "${project_name}-data",
  group   => "${project_name}-data",
  mode    => '0775',
  require => [
    Group["${project_name}-data"],
    User["${project_name}-data"],
    Vcsrepo['/opt/common-voice-bundler'],
  ],
}

class { 'python':
  version    => 'python3.5',
  pip        => true,
  dev        => true,
  virtualenv => true,
}->
package {'python3-venv':
  ensure => present,
}

file { $virtualenv_path:
  ensure => directory,
}

python::pyvenv { "${virtualenv_path}/corpora-creator":
  ensure  => present,
  version => '3.5',
  require => [
    File[$virtualenv_path],
  ],
}

python::pip {'setuptools':
  ensure => '40.8.0',
  virtualenv => "${virtualenv_path}/corpora-creator",
}

python::pip { 'corpora-creator':
  ensure     => 'present',
  virtualenv => "${virtualenv_path}/corpora-creator",
  url        => 'git+https://github.com/mozilla/CorporaCreator.git@90580daad03ca5c66b3409eb4fee4c2208f64320',
  require => [
    Python::Pip['setuptools'],
  ],
}

file {'/usr/local/bin/create-corpora':
  ensure => link,
  target => "${virtualenv_path}/corpora-creator/bin/create-corpora",
}
