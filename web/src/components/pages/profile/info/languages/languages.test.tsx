import * as React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { act, waitFor, fireEvent, RenderResult } from '@testing-library/react';

import { renderWithLocalization } from '../../../../../test/mock-localization';
import { UserAccentLocale } from 'common';

import ProfileInfoLanguages, { AccentsAll } from './languages';

expect.extend(toHaveNoViolations);

const MOCK_USER_LANGUAGES = [
  {
    locale: 'en',
    accents: [],
  },
] as UserAccentLocale[];

const MOCK_ACCENTS_ALL = {
  en: {
    userGenerated: {},
    preset: {
      '1': {
        id: 1,
        token: 'england',
        name: 'England English',
      },
      '2': {
        id: 2,
        token: 'singapore',
        name: 'Singaporean English',
      },
      '3': {
        id: 3,
        token: 'filipino',
        name: 'Filipino',
      },
    },
    default: {
      id: 18,
      token: 'unspecified',
      name: '',
    },
  },
  'zh-TW': {
    userGenerated: {},
    preset: {},
    default: {
      id: 176,
      token: 'unspecified',
      name: '',
    },
  },
} as AccentsAll;

// mock components
jest.mock('./input-language-name', () => ({
  default: () => {
    return <div></div>;
  },
}));
jest.mock('./input-language-accents/input-language-accents', () => ({
  default: () => {
    return <div></div>;
  },
}));

// mock api
const mockGetAccents = jest.fn(() => Promise.resolve(MOCK_ACCENTS_ALL));
jest.mock('../../../../../hooks/store-hooks', () => ({
  useAPI: () => {
    return {
      getAccents: mockGetAccents,
    };
  },
}));

describe('ProfileInfoLanguages', () => {
  it('should render with no accessibility violations', async () => {
    await act(async () => {
      const renderResult: RenderResult = await renderWithLocalization(
        <ProfileInfoLanguages
          userLanguages={MOCK_USER_LANGUAGES}
          setUserLanguages={() => null}
          setAreLanguagesLoading={() => null}
        />
      );
      const results = await axe(renderResult.container);
      expect(results).toHaveNoViolations();
    });
  });

  it('add a new language when lcikcin add new', async () => {
    await act(async () => {
      const mockSetLanguage = jest.fn();
      const { getByText, getByRole }: RenderResult =
        await renderWithLocalization(
          <ProfileInfoLanguages
            userLanguages={MOCK_USER_LANGUAGES}
            setUserLanguages={mockSetLanguage}
            setAreLanguagesLoading={() => null}
          />
        );

      await waitFor(() => {
        const languagesHeading = getByText('Languages');
        return expect(languagesHeading).toBeTruthy();
      });

      fireEvent.click(getByRole('button', { name: 'Add Language' }));

      expect(mockSetLanguage).toBeCalledWith([
        ...MOCK_USER_LANGUAGES,
        { locale: '', accents: [] },
      ]);
      expect(mockSetLanguage).toBeCalledTimes(1);
    });
  });
});
