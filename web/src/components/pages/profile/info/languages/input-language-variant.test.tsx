import * as React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { screen, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '../../../../../../test/render-with-providers';
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
    const renderResult: RenderResult = renderWithProviders(
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
    renderWithProviders(
      <InputLanguageVariant
        locale={'cy'}
        variantsAll={MOCK_VARIANTS_ALL}
        userLanguages={mockUserLanguages}
        setUserLanguages={mockSetUserLanguage}
      />
    );

    // pick an option in the select box
    userEvent.selectOptions(
      screen.getByLabelText('Which variant of Cymraeg do you speak?'),
      screen.getByRole('option', { name: 'North-Western Welsh' })
    );

    const expectedLanguage = {
      locale: 'cy',
      accents: [],
      variant: {
        id: 1,
        name: 'North-Western Welsh',
        locale: "cy",
        tag: 'cy-north',
      },
    } as UserLanguage;
    expect(mockSetUserLanguage).toBeCalledWith([expectedLanguage]);
    expect(mockSetUserLanguage).toBeCalledTimes(1);
  });

  it('should remove item if selecting default option', async () => {
    const filledMockUserLanguages = [
      { locale: 'cy', accents: [] },
      {
        locale: 'pt',
        accents: [],
        variant: {
          id: 1,
          name: 'Portuguese (Brasil)',
          tag: 'pt-BR',
          locale: 'pt'
        },
      },
    ] as UserLanguage[];
    renderWithProviders(
      <InputLanguageVariant
        locale={'pt'}
        variantsAll={MOCK_VARIANTS_ALL}
        userLanguages={filledMockUserLanguages}
        setUserLanguages={mockSetUserLanguage}
      />
    );

    // pick default option
    userEvent.selectOptions(
      screen.getByLabelText('Which variant of Português do you speak?'),
      screen.getByRole('option', { name: 'No variant selected' })
    );

    const expectedLanguages = [
      { locale: 'cy', accents: [] },
      { locale: 'pt', accents: [], variant: null },
    ] as UserLanguage[];
    expect(mockSetUserLanguage).toBeCalledWith(expectedLanguages);
  });
});
