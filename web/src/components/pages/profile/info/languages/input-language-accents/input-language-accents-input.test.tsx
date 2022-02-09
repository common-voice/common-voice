import * as React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithLocalization } from '../../../../../../test/mock-localization';
import { AccentsAll } from '../languages';
import { UserAccentLocale } from 'common';

import InputLanguageAccentsInput from './input-language-accents-input';

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

describe('InputLanguageAccentsInput', () => {
  // TODO: while this tests this is todo as there's accessibility work to fix this component
  it.skip('should render with no accessibility violations', async () => {
    const renderResult: RenderResult = await renderWithLocalization(
      <InputLanguageAccentsInput
        locale={'en'}
        accentsAll={MOCK_ACCENTS_ALL}
        userLanguages={MOCK_USER_LANGUAGES}
        setUserLanguages={() => null}
      />
    );
    const results = await axe(renderResult.container);
    expect(results).toHaveNoViolations();
  });

  it('should be able to search and add a accent', async () => {
    const mockSetUserLanguage = jest.fn();

    const { getByLabelText, getByRole, getByTestId } =
      await renderWithLocalization(
        <InputLanguageAccentsInput
          locale={'en'}
          accentsAll={MOCK_ACCENTS_ALL}
          userLanguages={MOCK_USER_LANGUAGES}
          setUserLanguages={mockSetUserLanguage}
        />
      );

    const input = getByLabelText('How would you describe your accent?');
    userEvent.type(input, 'Filip'); // type some of the text

    // TODO: this should not be found via test ID, it should be via a label
    const list = getByTestId('input-language-accents-input-list');
    userEvent.selectOptions(list, getByRole('option', { name: 'Filipino' }));

    expect(mockSetUserLanguage).toHaveBeenCalledWith([
      { accents: [{ id: 3, name: 'Filipino' }], locale: 'en' },
    ]);
    expect(mockSetUserLanguage).toHaveBeenCalledTimes(1);
  });
});
