import { config } from 'aws-sdk';

if (process.env.HTTP_PROXY) {
  // Currently have no TS typings for proxy-agent, so have to use plain require().
  const proxy = require('proxy-agent');

  config.update({
    httpOptions: { agent: proxy(process.env.HTTP_PROXY) },
  });
}
