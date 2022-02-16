import * as React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { screen, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithLocalization } from '../../../../../test/mock-localization';
import { UserLanguage } from 'common';
import { MOCK_VARIANTS_ALL } from './mocks';

import InputLanguageVariant from './input-language-variant';

expect.extend(toHaveNoViolations);

describe('InputLanguageVariant', () => {
  let mockUserLanguages = [] as UserLanguage[];
  let mockSetUserLanguage = null as (languages: UserLanguage[]) => void;

  beforeEach(() => {
    mockUserLanguages = [{ locale: 'cy', accents: [] }];
    mockSetUserLanguage = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with no accessibility violations', async () => {
    const renderResult: RenderResult = await renderWithLocalization(
      <InputLanguageVariant
        locale={'cy'}
        variantsAll={MOCK_VARIANTS_ALL}
        userLanguages={mockUserLanguages}
        setUserLanguages={mockSetUserLanguage}
      />
    );
    const results = await axe(renderResult.container);
    expect(results).toHaveNoViolations();
  });

  it('updates the language list when selecting an option', async () => {
    await renderWithLocalization(
      <InputLanguageVariant
        locale={'cy'}
        variantsAll={MOCK_VARIANTS_ALL}
        userLanguages={mockUserLanguages}
        setUserLanguages={mockSetUserLanguage}
      />
    );

    // pick an option in the select box
    userEvent.selectOptions(
      screen.getByLabelText('Is your language in any of these variants?'),
      screen.getByRole('option', { name: 'North-Western Welsh' })
    );

    const expectedLanguage = {
      locale: 'cy',
      accents: [],
      variant: {
        id: 1,
        name: 'North-Western Welsh',
        token: 'cy-north',
      },
    } as UserLanguage;
    expect(mockSetUserLanguage).toBeCalledWith([expectedLanguage]);
    expect(mockSetUserLanguage).toBeCalledTimes(1);
  });

  it('should remove item if selecting empty option', async () => {
    const filledMockUserLanguages = [
      { locale: 'en', accents: [] },
      {
        locale: 'cy',
        accents: [],
        variant: {
          id: 1,
          name: 'North-Western Welsh',
          token: 'cy-north',
        },
      },
    ] as UserLanguage[];
    await renderWithLocalization(
      <InputLanguageVariant
        locale={'cy'}
        variantsAll={MOCK_VARIANTS_ALL}
        userLanguages={filledMockUserLanguages}
        setUserLanguages={mockSetUserLanguage}
      />
    );

    // pick empty option
    userEvent.selectOptions(
      screen.getByLabelText('Is your language in any of these variants?'),
      screen.getByRole('option', { name: '' })
    );

    const expectedLanguages = [
      { locale: 'en', accents: [] },
      { locale: 'cy', accents: [], variant: null },
    ] as UserLanguage[];
    expect(mockSetUserLanguage).toBeCalledWith(expectedLanguages);
  });
});
