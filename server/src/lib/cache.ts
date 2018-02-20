import * as Random from 'random-js';

type FetchFunction<T> = (count: number) => T[] | Promise<T[]>;

export default class Cache<T> {
  private items: T[] = [];
  private size: number;
  private fetchMore: FetchFunction<T>;
  private refillPromise: Promise<void> = null;
  private randomEngine = Random.engines.mt19937().autoSeed();

  constructor(fetchMore: FetchFunction<T>, size = 1000) {
    this.fetchMore = fetchMore;
    this.size = size;
  }

  private async refill() {
    return (
      this.refillPromise ||
      (this.refillPromise = new Promise(async resolve => {
        this.items = this.items.concat(
          Random.shuffle(this.randomEngine, await this.fetchMore(this.size))
        );
        this.refillPromise = null;
        resolve();
      }))
    );
  }

  async getAll(): Promise<T[]> {
    if (this.items.length == 0) await this.refill();
    return this.items;
  }

  async take(count: number): Promise<T[]> {
    const items = await this.getAll();
    return items.splice(0, count);
  }

  async takeWhere(checkFn: (item: T) => boolean, count?: number): Promise<T[]> {
    const items = await this.getAll();
    const indicies = [];
    for (let i = 0; i < items.length; i++) {
      if (indicies.length >= count) {
        break;
      }

      if (checkFn(items[i])) {
        // When we splice the array later, we'll decrease the array size with every key, so here we
        // make sure the indices are still pointing to the right element.
        indicies.push(i - indicies.length);
      }
    }
    return indicies.map(i => items.splice(i, 1)[0]);
  }
}
