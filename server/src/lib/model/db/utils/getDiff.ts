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
  const idsToBeAdded = requestedIds.filter(id => !savedIds.includes(id));
  const idsToBeRemoved = savedIds.filter(id => !requestedIds.includes(id));

  return { idsToBeAdded, idsToBeRemoved };
};
