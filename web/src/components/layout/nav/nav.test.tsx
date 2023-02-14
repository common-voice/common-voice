import * as React from 'react';
import { screen } from '@testing-library/react';

import Nav from './nav';
import { renderWithProviders } from '../../../../test/render-with-providers';

describe('Nav test', () => {
  it('renders the Nav component', () => {
    renderWithProviders(<Nav shouldExpandNavItems />);

    expect(screen.getAllByText('Contribute')).toBeTruthy();
    expect(screen.getByText('Datasets')).toBeTruthy();
    expect(screen.getByText('Languages')).toBeTruthy();
    expect(screen.getByText('Partner')).toBeTruthy();
    expect(screen.getByText('About')).toBeTruthy();
  });
});
