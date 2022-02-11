export type IdDifferences = {
  idsToBeRemoved: number[];
  idsToBeAdded: number[];
};

/**
 * Get the difference of two arrays
 */
export const getDifferenceInIds = (
  requestedIds: number[],
  savedIds: number[]
): IdDifferences => {
  const idsToBeAdded: number[] = [];
  const idsToBeRemoved: number[] = [];

  requestedIds?.map(id => {
    if (!savedIds.includes(id)) idsToBeAdded.push(id);
  });

  savedIds?.map(id => {
    if (!requestedIds.includes(id)) idsToBeRemoved.push(id);
  });

  return { idsToBeRemoved, idsToBeAdded };
};
