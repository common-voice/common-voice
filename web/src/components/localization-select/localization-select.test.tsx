import * as React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { screen, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '../../../test/render-with-providers';
import LocalizationSelect from './localization-select';

expect.extend(toHaveNoViolations);

describe('LocalizationSelect', () => {
  it('should render with no accessibility violations', async () => {
    const renderResult: RenderResult = renderWithProviders(
      <LocalizationSelect onLocaleChange={() => null} />
    );
    const results = await axe(renderResult.container);
    expect(results).toHaveNoViolations();
  });

  it('should call onLocalChange with a new locale when changed', async () => {
    const onLocalChangeMock = jest.fn();
    renderWithProviders(
      <LocalizationSelect onLocaleChange={onLocalChangeMock} />
    );

    // pick an option in the select box
    userEvent.selectOptions(
      screen.getByLabelText('Choose language/localization'),
      screen.getByRole('option', { name: 'Azərbaycanca' })
    );

    expect(onLocalChangeMock).toBeCalledWith('az');
    expect(onLocalChangeMock).toBeCalledTimes(1);
  });
});
