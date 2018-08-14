export default function lazyCache<T, S>(
  f: (...args: S[]) => Promise<T>,
  timeMs: number
): (...args: S[]) => Promise<T> {
  const caches: {
    [key: string]: { at?: number; promise?: Promise<T>; value?: T };
  } = {};
  return async (...args) => {
    const key = JSON.stringify(args);

    let cached = caches[key];
    if (cached) {
      const { at, promise, value } = cached;
      if (Date.now() - at < timeMs) {
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
