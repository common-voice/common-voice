import lazyCache from '../lib/lazy-cache';

const randomString = () => Math.random().toString();

describe('lazyCache', () => {
  test('result is returned', async () => {
    expect(lazyCache(randomString(), async () => 23, 0)()).resolves.toBe(23);
  });

  test('f is called once', async () => {
    const f = jest.fn().mockReturnValue(23);
    const cachedF = lazyCache(randomString(), f, 1000);
    await cachedF();
    await cachedF();
    expect(f).toHaveBeenCalledTimes(1);
  });

  test('f is called twice', async () => {
    const f = jest.fn().mockReturnValue(23);
    const cachedF = lazyCache(randomString(), f, -1);
    await cachedF();
    await cachedF();
    expect(f).toHaveBeenCalledTimes(2);
  });

  test('serves old cache while refreshing', async () => {
    const f = jest.fn().mockReturnValueOnce(23).mockReturnValueOnce(42);
    const cachedF = lazyCache(randomString(), f, 1000);
    expect(await cachedF()).toBe(23);
    await new Promise(resolve => setTimeout(resolve, 1500));
    expect(await cachedF()).toBe(23);
    expect(await cachedF()).toBe(42);
  });

  test('same parameters hit the same cache', async () => {
    const f = jest.fn().mockReturnValue(23);
    const cachedF = lazyCache(randomString(), f, 1000);
    await cachedF(234);
    await cachedF(234);
    expect(f).toHaveBeenCalledTimes(1);
  });

  test('different parameters dont hit the same cache', async () => {
    const f = jest.fn().mockReturnValue(23);
    const cachedF = lazyCache(randomString(), f, 1000);
    await cachedF(234);
    await cachedF(567);
    expect(f).toHaveBeenCalledTimes(2);
  });
});
