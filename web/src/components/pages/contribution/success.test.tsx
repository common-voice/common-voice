import * as React from 'react';
import { act, screen } from '@testing-library/react';
import Success from './success';
import { renderWithProviders } from '../../../../test/render-with-providers';

const mockFetchDailyVotesCount = jest.fn(() => Promise.resolve(100));

jest.mock('../../../hooks/store-hooks', () => ({
  useAPI: () => {
    return {
      fetchDailyVotesCount: mockFetchDailyVotesCount,
    };
  },
  useAccount: () => {
    return {}; // As long as the object exists, we have an account.
  },
}));

describe('Pages/Contribution/Success', () => {
  it('it should have a locale path with the goals href', async () => {
    await act(async () => {
      renderWithProviders(<Success type="listen" onReset={() => undefined} />);
      const getStartedGoalsButton = screen.getByTestId('get-started-goals');
      const href = getStartedGoalsButton.getAttribute('href');
      // MockReactReduxProvider mocks the locale attribute to 'en'
      expect(href).toEqual('/en/goals');
    });
  });
});
