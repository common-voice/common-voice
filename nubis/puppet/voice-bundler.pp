vcsrepo { '/opt/common-voice-bundler':
  ensure   => present,
  provider => 'git',
  source   => 'https://github.com/Common-Voice/common-voice-bundler.git',
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
