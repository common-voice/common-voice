import * as React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import { act, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LanguageCardData from './data';
import { renderWithProviders } from '../../../../../test/render-with-providers';
import { LanguageStatistics } from 'common';

expect.extend(toHaveNoViolations);

const LAUNCHED_TYPE = 'launched';
const IN_PROGRESS_TYPE = 'in-progress';

const HOURS = {
  NONE: 0,
  ONE: 1,
  LOTS: 14002,
  EVEN_MORE: 23565,
};

const LANGUAGE_STATISTICS = [
  {
    is_contributable: true,
    sentencesCount: { targetSentenceCount: 5000, currentCount: 1576279 },
    localizedPercentage: 0,
    recordedHours: 100,
    validatedHours: 10,
    speakersCount: 23,
    locale: 'en',
  },
  {
    is_contributable: false,
    sentencesCount: { targetSentenceCount: 5000, currentCount: 1258 },
    localizedPercentage: 55,
    recordedHours: 0,
    validatedHours: 0,
    speakersCount: 0,
    locale: 'tar',
  },
] as LanguageStatistics[];

describe('LanguageCardData', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render with no accessibility violations', async () => {
    let renderResult: RenderResult;
    act(() => {
      renderResult = renderWithProviders(
        <LanguageCardData
          type={LAUNCHED_TYPE}
          language={LANGUAGE_STATISTICS[0]}
        />
      );
    });
    const results = await axe(renderResult.container);
    expect(results).toHaveNoViolations();
  });

  it('should render in progress language', async () => {
    let renderResult: RenderResult;
    act(() => {
      renderResult = renderWithProviders(
        <LanguageCardData
          type={IN_PROGRESS_TYPE}
          language={LANGUAGE_STATISTICS[1]}
        />
      );
    });
    const { queryByText } = renderResult;

    expect(queryByText(/Localized/)).toBeTruthy();
    expect(queryByText(/Speakers/)).toBeFalsy();
  });

  it('should render launched language', async () => {
    let renderResult: RenderResult;
    act(() => {
      renderResult = renderWithProviders(
        <LanguageCardData
          type={LAUNCHED_TYPE}
          language={LANGUAGE_STATISTICS[0]}
        />
      );
    });
    const { queryByText } = renderResult;

    expect(queryByText(/Speakers/)).toBeTruthy();
    expect(queryByText(/Localized/)).toBeFalsy();
  });

  it('should render launched language clip validation progress correctly', async () => {
    let renderResult: RenderResult;
    act(() => {
      renderResult = renderWithProviders(
        <LanguageCardData
          type={LAUNCHED_TYPE}
          language={LANGUAGE_STATISTICS[0]}
        />
      );
    });
    const { getByTestId } = renderResult;

    expect(getByTestId('clip-validation-percent').textContent).toBe('10%');
  });

  it('should render launched language hours correctly', async () => {
    let renderResult: RenderResult;
    act(() => {
      renderResult = renderWithProviders(
        <LanguageCardData
          type={LAUNCHED_TYPE}
          language={LANGUAGE_STATISTICS[0]}
        />
      );
    });
    const { getByTestId } = renderResult;

    expect(getByTestId('clip-recorded-hour').textContent).toBe(
      '' + LANGUAGE_STATISTICS[0].recordedHours
    );
  });
});
