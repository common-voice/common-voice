import * as React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { act, waitFor, fireEvent, RenderResult } from '@testing-library/react';

import { renderWithProviders } from '../../../../../../test/render-with-providers';
import {
  MOCK_USER_LANGUAGES,
  MOCK_ACCENTS_ALL,
  MOCK_VARIANTS_ALL,
} from './mocks';

import ProfileInfoLanguages from './languages';

expect.extend(toHaveNoViolations);

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
const mockGetVariants = jest.fn(() => Promise.resolve(MOCK_VARIANTS_ALL));
jest.mock('../../../../../hooks/store-hooks', () => ({
  useAPI: () => {
    return {
      getAccents: mockGetAccents,
      getVariants: mockGetVariants,
    };
  },
}));

describe('ProfileInfoLanguages', () => {
  it('should render with no accessibility violations', async () => {
    await act(async () => {
      const renderResult: RenderResult = renderWithProviders(
        <ProfileInfoLanguages
          userLanguages={MOCK_USER_LANGUAGES}
          setUserLanguages={() => null}
          setAreLanguagesLoading={value => value}
          areLanguagesLoading={false}
        />
      );
      const results = await axe(renderResult.container);
      expect(results).toHaveNoViolations();
    });
  });

  it('add a new language when clicking add new', async () => {
    await act(async () => {
      const mockSetLanguage = jest.fn();
      const { getByText, getByRole }: RenderResult = renderWithProviders(
        <ProfileInfoLanguages
          userLanguages={MOCK_USER_LANGUAGES}
          setUserLanguages={mockSetLanguage}
          setAreLanguagesLoading={value => value}
          areLanguagesLoading={false}
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
