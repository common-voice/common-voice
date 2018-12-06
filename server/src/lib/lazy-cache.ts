import * as Redis from 'ioredis';
import * as Redlock from 'redlock';

const redis = new Redis();
const redlock = new Redlock([redis]);
const useRedis = new Promise(resolve => {
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

type Fn<T, S> = (...args: S[]) => Promise<T>;

function isExpired(at: number, timeMs: number) {
  return Date.now() - at > timeMs;
}

function memoryCache<T, S>(f: Fn<T, S>, timeMs: number): Fn<T, S> {
  const caches: {
    [key: string]: { at?: number; promise?: Promise<T>; value?: T };
  } = {};
  return async (...args) => {
    const key = JSON.stringify(args);

    let cached = caches[key];
    if (cached) {
      const { at, promise, value } = cached;
      if (!isExpired(at, timeMs)) {
        return value;
      }

      if (promise) return value || promise;
    } else {
      caches[key] = cached = {};
    }

    return (cached.promise = new Promise(async resolve => {
      const hasOldCache = cached && cached.value;
      if (hasOldCache) resolve(cached.value);
      Object.assign(cached, {
        at: Date.now(),
        value: await f(...args),
        promise: null,
      });
      if (!hasOldCache) resolve(cached.value);
    }));
  };
}

function redisCache<T, S>(
  cacheKey: string,
  f: Fn<T, S>,
  timeMs: number
): Fn<T, S> {
  return async (...args) => {
    const key = cacheKey + JSON.stringify(args);
    const result = await redis.get(key);

    let value: any;
    let renewCache = true;
    if (result) {
      const cached = JSON.parse(result);
      value = cached.value;
      renewCache = isExpired(cached.at, timeMs);
    }

    if (!renewCache) return value;

    return new Promise(async resolve => {
      const lock = await redlock.lock(
        key + '-lock',
        1000 * 60 * 60 * 3 /*3 minutes*/
      );
      const result = await redis.get(key);
      if (result) {
        const cached = JSON.parse(result);
        renewCache = isExpired(cached.at, timeMs);
        resolve(cached.value);
      }

      if (renewCache) {
        value = await f(...args);
        await redis.set(key, JSON.stringify({ at: Date.now(), value }));
        resolve(value);
      }

      await lock.unlock();
    });
  };
}

export default function lazyCache<T, S>(
  cacheKey: string,
  f: Fn<T, S>,
  timeMs: number
): Fn<T, S> {
  const memCache = memoryCache(f, timeMs);
  return async (...args: S[]) =>
    ((await useRedis) ? redisCache(cacheKey, f, timeMs) : memCache)(...args);
}
