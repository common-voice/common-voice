import * as React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { screen, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '../../../../../../test/render-with-providers';
import { UserLanguage } from 'common';
import { MOCK_ACCENTS_ALL } from './mocks';

import InputLanguageName from './input-language-name';

expect.extend(toHaveNoViolations);

describe('InputLanguageName', () => {
  let mockUserLanguages = [] as UserLanguage[];
  let mockSetUserLanguage = null as (languages: UserLanguage[]) => void;

  beforeEach(() => {
    mockUserLanguages = [{ locale: '', accents: [] }];
    mockSetUserLanguage = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with no accessibility violations', async () => {
    const renderResult: RenderResult = renderWithProviders(
      <InputLanguageName
        locale={''}
        accentsAll={MOCK_ACCENTS_ALL}
        userLanguages={mockUserLanguages}
        setUserLanguages={mockSetUserLanguage}
      />
    );
    const results = await axe(renderResult.container);
    expect(results).toHaveNoViolations();
  });

  it('updates the language list when selecting an option', async () => {
    renderWithProviders(
      <InputLanguageName
        locale={''}
        accentsAll={MOCK_ACCENTS_ALL}
        userLanguages={mockUserLanguages}
        setUserLanguages={mockSetUserLanguage}
      />
    );

    // pick an option in the select box
    userEvent.selectOptions(
      screen.getByLabelText('Language'),
      screen.getByRole('option', { name: '臺語' })
    );

    const expectedLanguage = {
      locale: 'nan-tw',
      accents: [],
    } as UserLanguage;
    expect(mockSetUserLanguage).toBeCalledWith([expectedLanguage]);
    expect(mockSetUserLanguage).toBeCalledTimes(1);
  });

  it('should handle missing accents', async () => {
    renderWithProviders(
      <InputLanguageName
        locale={''}
        accentsAll={MOCK_ACCENTS_ALL}
        userLanguages={mockUserLanguages}
        setUserLanguages={mockSetUserLanguage}
      />
    );

    // pick an option in the select box
    userEvent.selectOptions(
      screen.getByLabelText('Language'),
      screen.getByRole('option', { name: 'Tagalog' })
    );

    const expectedUserLanguage = {
      locale: 'tl',
      accents: [],
    } as UserLanguage;
    expect(mockSetUserLanguage).toBeCalledWith([expectedUserLanguage]);
  });

  it('should remove item if selecting empty option', async () => {
    const filledMockUserLanguages = [
      { locale: 'tl', accents: [] },
      { locale: 'en', accents: [] },
      { locale: 'fr', accents: [] },
    ] as UserLanguage[];
    renderWithProviders(
      <InputLanguageName
        locale={'en'}
        accentsAll={MOCK_ACCENTS_ALL}
        userLanguages={filledMockUserLanguages}
        setUserLanguages={mockSetUserLanguage}
      />
    );

    // pick empty option
    userEvent.selectOptions(
      screen.getByLabelText('Language'),
      screen.getByRole('option', { name: '' })
    );

    const expectedLanguages = [
      { locale: 'tl', accents: [] },
      { locale: 'fr', accents: [] },
    ] as UserLanguage[];
    expect(mockSetUserLanguage).toBeCalledWith(expectedLanguages);
  });

  it('should remove duplicates if selecting same language', async () => {
    const filledMockLanguages = [
      { locale: 'fr', accents: [] },
      { locale: 'en', accents: [] },
    ] as UserLanguage[];
    renderWithProviders(
      <InputLanguageName
        locale={'en'}
        accentsAll={MOCK_ACCENTS_ALL}
        userLanguages={filledMockLanguages}
        setUserLanguages={mockSetUserLanguage}
      />
    );

    // pick empty option
    userEvent.selectOptions(
      screen.getByLabelText('Language'),
      screen.getByRole('option', { name: 'Français' })
    );

    const expectedLanguages = [{ locale: 'fr', accents: [] }] as UserLanguage[];
    expect(mockSetUserLanguage).toBeCalledWith(expectedLanguages);
  });
});
