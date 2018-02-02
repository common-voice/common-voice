import Cache from '../lib/cache';

test('cache gives expected objects', async () => {
  const item = 23;
  const cache = new Cache(n => Array(n).fill(item), 5);
  expect((await cache.getAll())[0]).toBe(item);
});

test('only refills once when empty', async () => {
  const fetchFn = jest.fn(async (n: number) => {
    await new Promise(resolve => setTimeout(resolve));
    return Array(n).fill(23);
  });
  const cache = new Cache(fetchFn, 3);

  await Promise.all([cache.getAll(), cache.getAll()]);
  expect(fetchFn).toHaveBeenCalledTimes(1);
});

test('retrieving from cache consecutive times, yields the same result', async () => {
  const fetchFn = jest.fn(async (n: number) => {
    await new Promise(resolve => setTimeout(resolve));
    return Array(n).fill(23);
  });
  const cache = new Cache(fetchFn, 3);

  const [result1, result2] = await Promise.all([
    cache.getAll(),
    cache.getAll(),
  ]);
  expect(result1).toBe(result2);
});
