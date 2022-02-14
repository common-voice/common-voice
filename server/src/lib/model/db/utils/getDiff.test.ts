import { getDifferenceInIds, IdDifferences } from './getDiff';

const emptyDifference: IdDifferences = { idsToBeRemoved: [], idsToBeAdded: [] };
const REQUESTED_IDS = [1, 2];
const SAVED_IDS = [2, 3];

const TO_BE_SAVED = [1];
const TO_BE_REMOVED = [3];

const REQUESTED_IDS_LONG = [3, 3, 4, 7, 5, 11, 6, 101, 1001, 1];
const SAVED_IDS_LONG = [2, 3, 4, 5, 6, 10, 11, 101, 111];

const TO_BE_SAVED_LONG = [7, 1001, 1];
const TO_BE_REMOVED_LONG = [2, 10, 111];

describe('getDifferenceInIds', () => {
  test('empty list of requested and saved Ids', () => {
    expect(getDifferenceInIds([], [])).toStrictEqual(emptyDifference);
  });

  test('empty list of requested and some saved Ids', () => {
    expect(getDifferenceInIds([], SAVED_IDS)).toStrictEqual({
      ...emptyDifference,
      idsToBeRemoved: SAVED_IDS,
    });
  });

  test('list of requested and empty list of saved Ids', () => {
    expect(getDifferenceInIds(REQUESTED_IDS, [])).toStrictEqual({
      ...emptyDifference,
      idsToBeAdded: REQUESTED_IDS,
    });
  });

  test('list of requested and  list of saved Ids', () => {
    expect(getDifferenceInIds(REQUESTED_IDS, SAVED_IDS)).toStrictEqual({
      idsToBeRemoved: TO_BE_REMOVED,
      idsToBeAdded: TO_BE_SAVED,
    });
  });

  test('long list of requested and log list of saved Ids', () => {
    expect(
      getDifferenceInIds(REQUESTED_IDS_LONG, SAVED_IDS_LONG)
    ).toStrictEqual({
      idsToBeRemoved: TO_BE_REMOVED_LONG,
      idsToBeAdded: TO_BE_SAVED_LONG,
    });
  });
});
