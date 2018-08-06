export default function lazyCache<T, S>(
  f: (...args: S[]) => Promise<T>,
  timeMs: number
): (...args: S[]) => Promise<T> {
  let cache: T;
  let cachedAt: number;
  let cachePromise: Promise<T>;
  return async (...args) => {
    if (cache && Date.now() - cachedAt < timeMs) {
      return cache;
    }

    if (cachePromise) return cache || cachePromise;

    return (cachePromise = new Promise(async resolve => {
      const hasOldCache = Boolean(cache);
      if (hasOldCache) resolve(cache);
      cache = await f(...args);
      cachedAt = Date.now();
      cachePromise = null;
      if (!hasOldCache) resolve(cache);
    }));
  };
}
