# Install Kibana
class { 'kibana':
  package_repo_version => '5.1',
  version              => '5.1.2',
  config               => {
    'server.basePath'   => '/kibana',
    'logging.quiet'     => true,
  },
}

# Fix dependency chains for apt update
Apt::Source['kibana'] -> Class['apt::update'] -> Package['kibana']
