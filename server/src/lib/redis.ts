import * as Redis from 'ioredis';
import * as Redlock from 'redlock';
import { getConfig } from '../config-helper';
import Logger from './logger';

const logger = new Logger({ name: 'redis' });

export const redis = new Redis(getConfig().REDIS_URL);

export const redlock = new Redlock([redis], { retryCount: -1 });

export const useRedis = new Promise(resolve => {
  redis.on('ready', () => {
    resolve(true);
  });
  redis.on('error', err => {
    resolve(false);
    return redis.quit();
  });
}).then(val => {
  logger.log('Cache is', val ? 'redis' : 'in-memory');
  return val;
});
