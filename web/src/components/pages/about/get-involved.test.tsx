import * as React from 'react';
import { screen } from '@testing-library/react';

import GetInvolved from './get-involved';
import { renderWithProviders } from '../../../../test/render-with-providers';

describe('GetInvolved component', () => {
  it('renders GetInvolved component', () => {
    renderWithProviders(<GetInvolved />);
    expect(screen.getByText('How do I stay in touch?')).toBeDefined();

    // email signup button should be visible because basket token is undefined
    expect(screen.queryByTestId('email-signup-button')).toBeDefined();
    expect(screen.queryByTestId('discourse-button')).toBeDefined();
  });

  it('hides email signup button if basket token is available', () => {
    renderWithProviders(<GetInvolved isSubscribedToMailingList />);

    expect(screen.queryByTestId('email-signup-button')).toBeNull();
    expect(screen.queryByTestId('discourse-button')).toBeDefined();
  });
});
