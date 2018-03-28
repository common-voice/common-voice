/**
 * We're splitting the dataset into three buckets; train, dev and test. That's a common technique
 * in ML: https://stats.stackexchange.com/a/19051
 */

export interface Split {
  train: number;
  dev: number;
  test: number;
}

export const IDEAL_SPLIT: Split = Object.freeze({
  train: 0.6,
  dev: 0.2,
  test: 0.2,
});

const sumValues = (split: Split): number =>
  Object.values(split).reduce((sum, n) => sum + n, 0);

export function normalize(split: Split) {
  const totalCount = sumValues(split) || 1;
  return Object.entries(split)
    .map(([key, count]) => [key, count / totalCount])
    .reduce((obj: any, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});
}

/**
 * Given a real split, in absolute numbers (i.e. count of occurrences) calculate a compensatory
 * split which would move the real data closer to the split defined as IDEAL_SPLIT.
 */
export function calculateCompensatorySplit(realSplit: Split): Split {
  const compensatorySplit: any = {};

  // Normalize the real split (so that the values sum up to 1) and set the split to the difference
  // from the ideal (or zero)
  for (const [bucket, count] of Object.entries(normalize(realSplit))) {
    const typedBucket = bucket as keyof Split;
    compensatorySplit[typedBucket] = Math.max(
      IDEAL_SPLIT[typedBucket] - count,
      0
    );
  }

  // When the value sum up to 0, we're already at the ideal split
  return sumValues(compensatorySplit) === 0
    ? IDEAL_SPLIT
    : normalize(compensatorySplit);
}

/**
 * Given a distribution, pick a random bucket based on the compensatory split of that distribution.
 */
export function randomBucketFromDistribution(distribution: Split): keyof Split {
  const random = Math.random();
  let totalProbability = 0;
  return Object.entries(calculateCompensatorySplit(distribution)).find(
    ([key, probability]) => {
      totalProbability += probability;
      if (random < totalProbability) return true;
    }
  )[0] as keyof Split;
}

export function rowsToDistribution(
  rows: { bucket: string; count: number }[]
): Split {
  return rows.reduce(
    (obj: Split, { bucket, count }: { bucket: string; count: number }) => ({
      ...obj,
      [bucket]: count,
    }),
    {
      train: 0,
      dev: 0,
      test: 0,
    }
  );
}
