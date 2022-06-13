import * as React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { act, RenderResult } from '@testing-library/react';

import { renderWithProviders } from '../../../../test/render-with-providers';

expect.extend(toHaveNoViolations);

import LanguagesPage from './languages';

const MOCK_LANGUAGE_STATS = {
  launched: [
    {
      locale: 'ab',
      recordedHours: 800,
      sentencesCount: {
        currentCount: 3000,
        targetSentenceCount: 5000,
      },
      speakersCount: 500,
      validatedHours: 1000,
    },
  ],
  inProgress: [
    {
      locale: 'ace',
      localizedPercentage: 15,
      sentencesCount: {
        currentCount: 87,
        targetSentenceCount: 750,
      },
    },
  ],
};

// mock api
const mockFetchCrossLocaleMessages = jest.fn(() => Promise.resolve([]));
const mockFetchLanguageStats = jest.fn(() =>
  Promise.resolve(MOCK_LANGUAGE_STATS)
);
jest.mock('../../../hooks/store-hooks', () => ({
  useAPI: () => {
    return {
      fetchCrossLocaleMessages: mockFetchCrossLocaleMessages,
      fetchLanguageStats: mockFetchLanguageStats,
    };
  },
}));

describe('LanguagesRequestFormPage', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render with no accessibility violations', async () => {
    await act(async () => {
      const renderResult: RenderResult = renderWithProviders(<LanguagesPage />);
      const results = await axe(renderResult.container);
      expect(results).toHaveNoViolations();
    });
  });

  // TODO: calls api correctly
  // TODO: pressing show more shows more
  // TODO: search searches
  // TODO: clicking in progress button opens modal
});
