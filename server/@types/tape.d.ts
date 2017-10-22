import { Test } from 'tape';

declare namespace tape {
  interface Test {
    test(name: string, opts: any, cb: Function): void;
  }
}
