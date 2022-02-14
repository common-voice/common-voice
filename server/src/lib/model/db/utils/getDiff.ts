export type IdDifferences = {
  idsToBeRemoved: number[];
  idsToBeAdded: number[];
};

/**
 * Get the differences of numbers in two arrays
 */
export const getDifferenceInIds = (
  requestedIds: number[],
  savedIds: number[]
): IdDifferences => {
  const idsToBeAdded = requestedIds.map(id => {
    if (!savedIds.includes(id)) return id;
  });

  const idsToBeRemoved = savedIds.map(id => {
    if (!requestedIds.includes(id)) return id;
  });

  return { idsToBeAdded, idsToBeRemoved };
};
