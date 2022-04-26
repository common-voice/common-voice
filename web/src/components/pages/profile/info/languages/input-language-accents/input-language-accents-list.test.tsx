import * as React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { fireEvent, RenderResult } from '@testing-library/react';

import { renderWithLocalization } from '../../../../../../../test/render-with-localization';

import InputLanguageAccentsList from './input-language-accents-list';
import { UserLanguage } from 'common';

expect.extend(toHaveNoViolations);

const MOCK_ACCENTS = [
  {
    id: 1,
    token: 'england',
    name: 'England English',
  },
  {
    id: 13,
    token: 'singapore',
    name: 'Singaporean English',
  },
];

const MOCK_USER_LANGUAGES = [] as UserLanguage[];

describe('InputLanguageAccentsList', () => {
  it('should render with no accessibility violations', async () => {
    const renderResult: RenderResult = renderWithLocalization(
      <InputLanguageAccentsList
        locale={'en'}
        accents={MOCK_ACCENTS}
        userLanguages={MOCK_USER_LANGUAGES}
        setUserLanguages={() => null}
      />
    );
    const results = await axe(renderResult.container);
    expect(results).toHaveNoViolations();
  });

  it('renders accents in a list', async () => {
    const mockUserLanguages = [
      {
        locale: 'en',
        accents: [{ name: 'England English' }, { name: 'Singaporean English' }],
      },
    ] as UserLanguage[];
    const { getByText } = renderWithLocalization(
      <InputLanguageAccentsList
        locale={'en'}
        accents={MOCK_ACCENTS}
        userLanguages={mockUserLanguages}
        setUserLanguages={() => null}
      />
    );

    expect(getByText('England English')).toBeTruthy();
    expect(getByText('Singaporean English')).toBeTruthy();
  });

  it('should remove an accent', async () => {
    const mockUserLanguages = [
      {
        locale: 'en',
        accents: [{ name: 'England English' }, { name: 'Singaporean English' }],
      },
    ] as UserLanguage[];
    const mockSetUserLanguage = jest.fn();
    const { getByText } = renderWithLocalization(
      <InputLanguageAccentsList
        locale={'en'}
        accents={MOCK_ACCENTS}
        userLanguages={mockUserLanguages}
        setUserLanguages={mockSetUserLanguage}
      />
    );

    fireEvent.click(getByText(/Remove England English accent/));

    expect(mockSetUserLanguage).toBeCalledWith([
      { accents: [{ name: 'Singaporean English' }], locale: 'en' },
    ]);
    expect(mockSetUserLanguage).toBeCalledTimes(1);
  });
});
