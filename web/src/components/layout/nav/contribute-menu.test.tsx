import * as React from 'react';
import { fireEvent, screen } from '@testing-library/react';

import ContributeMenu from './contribute-menu';
import { renderWithProviders } from '../../../../test/render-with-providers';

describe('Contribute Menu Test', () => {
  it('renders Contribute Menu', async () => {
    renderWithProviders(
      <ContributeMenu
        showMenu={false}
        setShowMenu={jest.fn()}
        showMobileMenu={false}
        toggleMobileMenuVisible={jest.fn()}
        isContributionPageActive={false}
      />
    );

    expect(screen.queryByTestId('contribute-menu')).toBeTruthy();
    expect(await screen.findByText('Speak')).toBeTruthy();
    expect(await screen.findByText('Listen')).toBeTruthy();
  });

  it('shows the menu on hover', () => {
    const setShowMenuSpy = jest.fn();

    renderWithProviders(
      <ContributeMenu
        showMenu={false}
        setShowMenu={setShowMenuSpy}
        showMobileMenu={false}
        toggleMobileMenuVisible={jest.fn()}
        isContributionPageActive={false}
      />
    );

    fireEvent.mouseEnter(screen.getByTestId('contribute-menu'));
    expect(setShowMenuSpy).toHaveBeenCalledWith(true);
  });
});
