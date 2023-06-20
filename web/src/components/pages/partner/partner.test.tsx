import * as React from 'react';
import { screen } from '@testing-library/react';

import Partner from './partner';
import { renderWithProviders } from '../../../../test/render-with-providers';

describe('Partner component', () => {
  it('renders Partnerships page', () => {
    renderWithProviders(<Partner />);

    expect(screen.getByTestId('partnerships-page')).toBeDefined();

    const partnershipsHeading = screen.getByText('Partnerships');
    expect(partnershipsHeading).toBeDefined();

    const becomeACommonVoicePartnerHeading = screen.getByText(
      'Become a Common Voice Partner'
    );
    expect(becomeACommonVoicePartnerHeading).toBeDefined();
  });
});
