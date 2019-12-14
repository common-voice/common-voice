class { 'nubis_apache':
  tags => [
    'metrics',
    '%%PURPOSE%%-%%ENVIRONMENT%%',
    '%%PURPOSE%%',
  ],
}

file { '/etc/apache2/conf.d/elasticsearch.conf':
  ensure  => present,
  owner   => 'root',
  group   => 'root',
  mode    => '0644',
  content => @("EOT"/$)
Define ES_ENDPOINT "http://localhost:9200"
EOT
}

# Add modules
class { 'apache::mod::rewrite': }
class { 'apache::mod::ssl': }
class { 'apache::mod::proxy': }
class { 'apache::mod::proxy_http': }

apache::vhost { $project_name:
    port               => 80,
    default_vhost      => true,
    docroot            => "/var/www/${project_name}/web",
    docroot_owner      => 'root',
    docroot_group      => 'root',
    block              => ['scm'],
    ssl_proxyengine    => true,
    setenvif           => [
      'X-Forwarded-Proto https HTTPS=on',
      'Remote_Addr 127\.0\.0\.1 internal',
      'Remote_Addr ^10\. internal',
    ],
    access_log_env_var => '!internal',
    access_log_format  => '%a %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-agent}i\"',

    directories        => [
      {
        path            => "/var/www/${project_name}/web",
        custom_fragment => "
    # Handle and compress font files
    AddType text/ftl .ftl
    AddType application/x-font-ttf        .ttf
    AddOutputFilterByType DEFLATE application/x-font-ttf

    # Deflate JavaScript
    AddOutputFilterByType DEFLATE text/javascript application/javascript

    # Deflate CSS
    AddOutputFilterByType DEFLATE text/css

    # Deflate SVG images
    AddOutputFilterByType DEFLATE image/svg+xml

    # Deflate FTL
    AddOutputFilterByType DEFLATE text/ftl

    # Sane expires defaults
    ExpiresActive On
    ExpiresDefault none

    # Assets
    AddType image/ico .ico
    ExpiresByType image/*  'access plus 60 days'
    ExpiresByType text/javascript 'access plus 1 hour'
    ExpiresByType application/javascript 'access plus 1 hour'
    ExpiresByType text/css 'access plus 1 hour'
    ExpiresByType text/ftl 'access plus 1 hour'

    # Fonts
    ExpiresByType application/x-font-ttf 'access plus 60 days'
      ",
      }
    ],


    custom_fragment    => "

    # Don't set default expiry on anything
    ExpiresActive Off

    # Proxy to nodejs ( keep retrying on backend failures )
    ProxyPass /server-status !

    # Handle static content ourselves
    ProxyPass /dist/bundle.js !
    ProxyPass /dist/index.css !
    ProxyPass /img !
    ProxyPass /font !
    ProxyPass /locales !

    # Turn off CSP for ES/Kibana
    <Location /_plugin/kibana>
      Header unset Content-Security-Policy
      Header unset X-Content-Type-Options
    </Location>

    ProxyTimeout 30
    ProxyPass / http://localhost:9000/ retry=1
    ProxyPassReverse / http://localhost:9000/

",
    headers            => [
      # Nubis headers
      "set X-Nubis-Version ${project_version}",
      "set X-Nubis-Project ${project_name}",
      "set X-Nubis-Build   ${packer_build_name}",

      # Security Headers
    ],
    rewrites           => [
      {
        comment      => 'HTTPS redirect',
        rewrite_cond => ['%{HTTP:X-Forwarded-Proto} =http'],
        rewrite_rule => ['. https://%{HTTP:Host}%{REQUEST_URI} [L,R=permanent]'],
      }
    ]
}
