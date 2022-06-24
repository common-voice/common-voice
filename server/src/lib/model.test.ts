import Model from './model';
import DB from './model/db';
import { jest } from '@jest/globals';
import { Language } from 'common';
jest.mock('./model/db');

const LANGUAGES = [
  {
    id: 1,
    name: 'en',
    sentenceCount: {
      currentCount: 100,
      targetSentenceCount: 100,
    },
    is_contributable: true,
    is_translated: true,
    native_name: 'English',
    text_direction: 'LTR',
  },
] as Language[];

const mockGetLanguages = jest.fn(() => Promise.resolve(LANGUAGES));
DB.prototype.getLanguages = mockGetLanguages;

describe('Model class', () => {
  const model = new Model();

  describe('getLanguageStats', () => {
    it('returns langauge stats appropriately', async () => {
      const testModel = new Model();
      jest.spyOn(testModel, 'getLanguageStats');

      testModel.getLanguageStats();
      const mockModelInstance = DB.mock.instances[0];
      expect(testModel).toHaveBeenCalledTimes(1);
    });
  });
});
