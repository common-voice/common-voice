import memoize from '../lib/memoize';

describe('memoize', () => {
  test('result is returned', async () => {
    expect(memoize(async () => 23, 0)()).resolves.toBe(23);
  });

  test('f is only called once', () => {
    const f = jest.fn();
    const memoizedF = memoize(f, 1000);
    memoizedF();
    memoizedF();
    expect(f).toHaveBeenCalledTimes(1);
  });
});
