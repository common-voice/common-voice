class { 'nubis_apache':
  tags => [
    'metrics',
    '%%PURPOSE%%-%%ENVIRONMENT%%',
    '%%PURPOSE%%',
  ],
}

# Add modules
class { 'apache::mod::rewrite': }
class { 'apache::mod::proxy': }
class { 'apache::mod::proxy_http': }

apache::vhost { $project_name:
    port               => 80,
    default_vhost      => true,
    docroot            => "/var/www/${project_name}/web",
    docroot_owner      => 'root',
    docroot_group      => 'root',
    block              => ['scm'],
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

    <Location /grafana>
        ProxyPass /grafana http://localhost:3000 disablereuse=on ttl=60
        ProxyPassReverse /grafana http://localhost:3000
    </Location>

    <Location /kibana>
        ProxyPass /kibana http://localhost:5601 disablereuse=on ttl=60
        ProxyPassReverse /kibana http://localhost:5601
    </Location>

    ProxyPass / http://localhost:9000/ retry=0
    ProxyPassReverse / http://localhost:9000/

",
    headers            => [
      # Nubis headers
      "set X-Nubis-Version ${project_version}",
      "set X-Nubis-Project ${project_name}",
      "set X-Nubis-Build   ${packer_build_name}",

      # Security Headers
      'set X-Content-Type-Options "nosniff"',
      'set X-XSS-Protection "1; mode=block"',
      'set X-Frame-Options "DENY"',
      'set Strict-Transport-Security "max-age=31536000"',
      # media-src blob: is required for recording audio.
      'set Content-Security-Policy "default-src \'none\'; style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com https://optimize.google.com; img-src \'self\' www.google-analytics.com www.gstatic.com https://optimize.google.com https://www.gstatic.com https://gravatar.com data:; media-src data: blob: https://*.amazonaws.com https://*.amazon.com; script-src \'self\' \'unsafe-eval\' \'sha256-yybRmIqa26xg7KGtrMnt72G0dH8BpYXt7P52opMh3pY=\' \'sha256-jfhv8tvvalNCnKthfpd8uT4imR5CXYkGdysNzQ5599Q=\' https://www.google-analytics.com https://pontoon.mozilla.org https://optimize.google.com https://sentry.io; font-src \'self\' https://fonts.gstatic.com; connect-src \'self\' https://pontoon.mozilla.org/graphql https://www.gstatic.com https://www.google-analytics.com https://*.amazonaws.com https://sentry.io https://basket.mozilla.org; frame-src https://optimize.google.com;"'
    ],
    rewrites           => [
      {
        comment      => 'HTTPS redirect',
        rewrite_cond => ['%{HTTP:X-Forwarded-Proto} =http'],
        rewrite_rule => ['. https://%{HTTP:Host}%{REQUEST_URI} [L,R=permanent]'],
      }
    ]
}
