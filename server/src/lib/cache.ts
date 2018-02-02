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

  async getAll(): Promise<T[]> {
    if (this.items.length == 0) await this.refill();
    return this.items;
  }

  take(index: number): T {
    return this.items.splice(index, 1)[0];
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
}
