export default function<T>(
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

    if (cachePromise) return cachePromise;

    return (cachePromise = new Promise(async resolve => {
      cache = await f();
      cachedAt = Date.now();
      cachePromise = null;
      resolve(cache);
    }));
  };
}
