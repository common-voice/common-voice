import Cache from '../lib/cache';

test('cache gives expected objects', async () => {
  const item = 23;
  const cache = new Cache(n => Array(n).fill(item), null, 5);
  expect((await cache.getAll())[0]).toBe(item);
});

test('only refills once when empty', async () => {
  const fetchFn = jest.fn(async (n: number) => {
    await new Promise(resolve => setTimeout(resolve));
    return Array(n).fill(23);
  });
  const cache = new Cache(fetchFn, null, 3);

  await Promise.all([cache.getAll(), cache.getAll()]);
  expect(fetchFn).toHaveBeenCalledTimes(1);
});

test('retrieving from cache consecutive times, yields the same result', async () => {
  const fetchFn = jest.fn(async (n: number) => {
    await new Promise(resolve => setTimeout(resolve));
    return Array(n).fill(23);
  });
  const cache = new Cache(fetchFn, null, 3);

  const [result1, result2] = await Promise.all([
    cache.getAll(),
    cache.getAll(),
  ]);
  expect(result1).toBe(result2);
});

test('takeWhere', async () => {
  const cache = new Cache(() => [1, 2, 3, 4], null, 2);
  await cache.takeWhere(n => n % 2 == 0);
  const items = await cache.getAll();
  for (const n of items) {
    expect(n % 2 == 1).toBeTruthy();
  }
  expect(items.length).toBe(2);
});
