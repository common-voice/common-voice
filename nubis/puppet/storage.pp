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
  ensure  => 'directory',
  owner   => "${project_name}-data",
  group   => "${project_name}-data",
  mode    => '0770',
  require => [
    Group["${project_name}-data"],
    User["${project_name}-data"],
  ],
}
