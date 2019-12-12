import * as Redis from 'ioredis';
import * as Redlock from 'redlock';
import { getConfig } from '../config-helper';

export const redis = new Redis(getConfig().REDIS_URL);

export const redlock = new Redlock([redis]);

export const useRedis = new Promise(resolve => {
  redis.on('ready', () => {
    resolve(true);
  });
  redis.on('error', err => {
    resolve(false);
    return redis.quit();
  });
}).then(val => {
  console.log('Cache is', val ? 'redis' : 'in-memory');
  return val;
});
