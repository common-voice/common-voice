vcsrepo { '/opt/common-voice-bundler':
  ensure   => present,
  provider => 'git',
  source   => 'https://github.com/Common-Voice/common-voice-bundler.git',
  revision => '2d1be963ea0cbdfc5570c1e4d90f20e19d1b11bc',
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
