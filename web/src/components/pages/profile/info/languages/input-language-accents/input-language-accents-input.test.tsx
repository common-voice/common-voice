import * as React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { fireEvent, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithLocalization } from '../../../../../../../test/render-with-localization';
import { MOCK_USER_LANGUAGES, MOCK_ACCENTS_ALL } from '../mocks';

import InputLanguageAccentsInput from './input-language-accents-input';

expect.extend(toHaveNoViolations);

describe('InputLanguageAccentsInput', () => {
  // TODO: while this tests this is todo as there's accessibility work to fix this component
  it.skip('should render with no accessibility violations', async () => {
    const renderResult: RenderResult = renderWithLocalization(
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

    const { getByLabelText, getByRole, getByTestId } = renderWithLocalization(
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

  it('should let you add a custom accent', async () => {
    const mockSetUserLanguage = jest.fn();

    const { getByLabelText, getByRole, getByTestId } = renderWithLocalization(
      <InputLanguageAccentsInput
        locale={'en'}
        accentsAll={MOCK_ACCENTS_ALL}
        userLanguages={MOCK_USER_LANGUAGES}
        setUserLanguages={mockSetUserLanguage}
      />
    );

    const input = getByLabelText('How would you describe your accent?');
    userEvent.type(input, 'Brummy'); // type some of the text

    // TODO: this should not be found via test ID, it should be via a label
    const list = getByTestId('input-language-accents-input-list');
    userEvent.selectOptions(
      list,
      getByRole('option', { name: 'Add new custom accent "Brummy"' })
    );

    expect(mockSetUserLanguage).toHaveBeenCalledWith([
      { accents: [{ id: null, name: 'Brummy' }], locale: 'en' },
    ]);
    expect(mockSetUserLanguage).toHaveBeenCalledTimes(1);
  });

  it('should not let you add a empty custom accent', async () => {
    const mockSetUserLanguage = jest.fn();

    const { getByLabelText, getByRole, getByTestId } = renderWithLocalization(
      <InputLanguageAccentsInput
        locale={'en'}
        accentsAll={MOCK_ACCENTS_ALL}
        userLanguages={MOCK_USER_LANGUAGES}
        setUserLanguages={mockSetUserLanguage}
      />
    );

    const input = getByLabelText('How would you describe your accent?');
    userEvent.type(input, '     '); // type some empty text
    fireEvent.keyDown(input, { key: 'Enter', code: 13 }); // press enter to submit text

    expect(mockSetUserLanguage).toHaveBeenCalledTimes(0);
  });
});
