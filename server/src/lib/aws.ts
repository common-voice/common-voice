import { config } from 'aws-sdk';

if (process.env.HTTP_PROXY) {
  var proxy = require('proxy-agent');

  config.update({
    httpOptions: { agent: proxy(process.env.HTTP_PROXY) },
  });
}
