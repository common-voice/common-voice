import * as React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { act, RenderResult } from '@testing-library/react';

import { renderWithProviders } from '../../../../test/render-with-providers';

expect.extend(toHaveNoViolations);

import LanguagesPage from './languages';

const MOCK_LANGUAGE_STATS = [
  {
    id: 1,
    is_contributable: 1,
    sentencesCount: {
      targetSentenceCount: 5000,
      currentCount: 1576279,
    },
    localizedPercentage: 0,
    recordedHours: 1,
    validatedHours: 1,
    speakersCount: 23,
    locale: 'en',
  },
  {
    id: 11,
    is_contributable: 1,
    sentencesCount: {
      targetSentenceCount: 750,
      currentCount: 1576,
    },
    localizedPercentage: 63,
    recordedHours: 0,
    validatedHours: 0,
    speakersCount: 0,
    locale: 'ast',
  },
];

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
