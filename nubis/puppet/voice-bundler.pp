vcsrepo { '/opt/common-voice-bundler':
  ensure   => present,
  provider => 'git',
  source   => 'https://github.com/gozer/common-voice-bundler.git',
  revision => 'dd43fe00a2acec3aa9933604a7a61d445c700a9b',
}->
exec { 'install common-voice-bundler deps':
  command   => 'yarn',
  logoutput => true,
  cwd       => "/opt/common-voice-bundler",
  path      => [ '/bin', '/usr/bin', '/usr/local/bin' ],
  require   => [
    Class['Nodejs'],
    Exec['install yarn'],
  ],
}
