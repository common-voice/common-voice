import { getDifferenceInIds, IdDifferences } from './getDiff';

const emptyDifference: IdDifferences = { idsToBeRemoved: [], idsToBeAdded: [] };
const SAVED_IDS = [2, 3];
const REQUESTED_IDS = [1, 2];

const TO_BE_SAVED = [1];
const TO_BE_REMOVED = [3];
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
});
