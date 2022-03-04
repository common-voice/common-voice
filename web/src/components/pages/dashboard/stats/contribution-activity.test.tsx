import * as React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  act,
  waitFor,
  fireEvent,
  RenderResult,
  render,
} from '@testing-library/react';

import ContributionActivity from './contribution-activity';

expect.extend(toHaveNoViolations);

// mock components
jest.mock('../../../plot/plot', () => ({
  BarPlot: () => {
    return <div></div>;
  },
}));

// mock api
const mockFetchContributionActivity = jest.fn(() => Promise.resolve([]));
jest.mock('../../../../hooks/store-hooks', () => ({
  useAPI: () => {
    return {
      fetchContributionActivity: mockFetchContributionActivity,
    };
  },
}));

describe('ProfileInfoLanguages', () => {
  it('should render with no accessibility violations', async () => {
    await act(async () => {
      const renderResult: RenderResult = await render(
        <ContributionActivity from="you" locale="en" />
      );
      const results = await axe(renderResult.container);
      expect(results).toHaveNoViolations();
    });
  });

  it('should call the api when props change', async () => {
    await act(async () => {
      const { rerender }: RenderResult = await render(
        <ContributionActivity from="you" locale="en" />
      );

      expect(mockFetchContributionActivity).toBeCalledWith('you', 'en');

      // we change tab and update the props
      rerender(<ContributionActivity from="everyone" locale="en" />);

      await waitFor(() =>
        expect(mockFetchContributionActivity).toBeCalledWith('everyone', 'en')
      );
    });
  });
});
