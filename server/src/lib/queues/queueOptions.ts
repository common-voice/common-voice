import { getConfig } from '../../config-helper';

export const getRedisConfig = () => {
  const redisUrlParts = getConfig().REDIS_URL?.split('//');
  if (!redisUrlParts) return { host: '' }; //config fails on test

  const redisDomain =
    redisUrlParts.length > 1 ? redisUrlParts[1] : redisUrlParts[0];

  let redisOpts: any = { host: redisDomain };
  if (getConfig().REDIS_URL.includes('rediss://')) {
    redisOpts = { ...redisOpts, tls: redisOpts };
  }
  return redisOpts;
};
