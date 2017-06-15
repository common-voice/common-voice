package { 'sox':
  ensure => 'latest',
}

package { 'libav-tools':
  ensure => 'latest',
}

# Create a symlink to cheat a little
file { '/usr/bin/ffmpeg':
  ensure => 'link',
  target => '/usr/bin/avconv',
}
