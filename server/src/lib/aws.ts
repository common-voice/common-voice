var AWS = require('aws-sdk');

if (process.env.HTTP_PROXY) {
  var proxy = require('proxy-agent');

  AWS.config.update({
    httpOptions: { agent: proxy(process.env.HTTP_PROXY) },
  });
}

module.exports = AWS;
