export default function lazyCache<T>(
  f: () => Promise<T>,
  timeMs: number
): () => Promise<T> {
  let cache: T;
  let cachedAt: number;
  let cachePromise: Promise<T>;
  return async () => {
    if (cache && Date.now() - cachedAt < timeMs) {
      return cache;
    }

    if (cachePromise) return cache || cachePromise;

    return (cachePromise = new Promise(async resolve => {
      const hasOldCache = Boolean(cache);
      if (hasOldCache) resolve(cache);
      cache = await f();
      cachedAt = Date.now();
      cachePromise = null;
      if (!hasOldCache) resolve(cache);
    }));
  };
}
