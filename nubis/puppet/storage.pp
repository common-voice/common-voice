include nubis_storage
nubis::storage { $project_name:
  type  => 'efs',
  owner => 'voice-data',
  group => 'voice-data',
}

# Create a user and a group for this
group { "${project_name}-data":
  ensure => 'present',
  gid    => '400',
}

user { "${project_name}-data":
  ensure  => 'present',
  uid     => '400',
  gid     => '400',
  home    => "/var/www/${project_name}",
  shell   => '/usr/sbin/nologin',
  require => [
    Group["${project_name}-data"],
  ],
}

# Link to our mountpoint
file { "/var/www/${project_name}/server/upload":
  ensure => 'link',
  target => "/data/${project_name}",
}
