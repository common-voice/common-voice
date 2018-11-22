const consul = require('consul')({ promisify: true });
import { getConfig } from '../config-helper';

const { ENVIRONMENT } = getConfig();

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

function consulCache<T, S>(
  cacheKey: string,
  f: Fn<T, S>,
  timeMs: number
): Fn<T, S> {
  return async (...args) => {
    const key = cacheKey + JSON.stringify(args);
    const result = await consul.kv.get(key);

    let value: any;
    let renewCache = true;
    if (result && result.Value) {
      const cached = JSON.parse(result.Value);
      value = cached.value;
      renewCache = isExpired(cached.at, timeMs);
    }

    if (!renewCache) return value;

    return new Promise(resolve => {
      const lock = consul.lock({ key: key + '-lock' });
      lock.on('acquire', async () => {
        const result = await consul.kv.get(key);
        if (result && result.Value) {
          const cached = JSON.parse(result.Value);
          renewCache = isExpired(cached.at, timeMs);
          resolve(cached.value);
        }

        if (renewCache) {
          value = await f(...args);
          await consul.kv.set(key, JSON.stringify({ at: Date.now(), value }));
          resolve(value);
        }

        await lock.release();
      });

      lock.acquire();
    });
  };
}

export default function lazyCache<T, S>(
  cacheKey: string,
  f: Fn<T, S>,
  timeMs: number
): Fn<T, S> {
  return !ENVIRONMENT || ENVIRONMENT === 'default'
    ? memoryCache(f, timeMs)
    : consulCache(cacheKey, f, timeMs);
}
