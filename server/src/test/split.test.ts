const { printReceived, printExpected } = require('jest-matcher-utils');
import {
  calculateCompensatorySplit,
  IDEAL_SPLIT,
  normalize,
  randomBucketFromDistribution,
  Split,
} from '../lib/model/split';

expect.extend({
  toAllBeCloseTo(received, argument, precision = 2) {
    const found = Object.keys(received).find(key => {
      const pass =
        Math.abs(received[key] - argument[key]) < Math.pow(10, -precision) / 2;
      return !pass;
    });

    return {
      pass: !found,
      message: () =>
        `Expected ${printReceived(received)} to be equal to ${printExpected(
          argument
        )}`,
    };
  },
});

describe('calculate compensatory split', () => {
  test('only training data', () => {
    expect(calculateCompensatorySplit({ train: 1, dev: 0, test: 0 })).toEqual({
      train: 0,
      dev: 0.5,
      test: 0.5,
    });
  });

  test('mixed data', () => {
    (expect as any)(
      calculateCompensatorySplit({ train: 0.2, dev: 0.7, test: 0.1 })
    ).toAllBeCloseTo({
      train: 0.8,
      dev: 0,
      test: 0.2,
    });
  });

  test('data all equal', () => {
    (expect as any)(
      calculateCompensatorySplit({ train: 0.3, dev: 0.3, test: 0.3 })
    ).toAllBeCloseTo({
      train: 1,
      dev: 0,
      test: 0,
    });
  });

  test('for no data, we do the ideal split', () => {
    (expect as any)(
      calculateCompensatorySplit({ train: 0, dev: 0, test: 0 })
    ).toAllBeCloseTo(IDEAL_SPLIT);
  });

  test('ideal split stays the same', () => {
    expect(calculateCompensatorySplit(IDEAL_SPLIT)).toEqual(IDEAL_SPLIT);
  });
});

/**
 * Contains randomness, may fail. Pray for law of large numbers.
 */
test('pick random bucket given a split probability', () => {
  const distribution: Split = {
    train: 0,
    dev: 0,
    test: 0,
  };
  for (let i = 0; i < 100000; i++) {
    distribution[randomBucketFromDistribution(IDEAL_SPLIT)]++;
  }
  (expect as any)(normalize(distribution)).toAllBeCloseTo(IDEAL_SPLIT, 1);
});
