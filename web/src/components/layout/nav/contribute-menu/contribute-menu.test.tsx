import * as React from 'react'
import { fireEvent, screen } from '@testing-library/react'

import ContributeMenu from '.'
import { renderWithProviders } from '../../../../../test/render-with-providers'
import { menuItems } from '../menu-items'

describe('Contribute Menu Test', () => {
  it('renders Contribute Menu', async () => {
    renderWithProviders(
      <ContributeMenu
        showMenu={false}
        setShowMenu={jest.fn()}
        showMobileMenu={false}
        isContributionPageActive={false}
        isUserLoggedIn
        menuItems={menuItems['speak'].items}
        menuLabel="speak"
        menuTooltip="mock-menu-tooltip"
        menuAriaLabel="mock-menu-aria-label"
      />
    )

    expect(screen.queryByTestId('contribute-menu')).toBeTruthy()
    expect(await screen.findAllByText('Speak')).toBeTruthy()
  })

  it('shows the menu on click', () => {
    const setShowMenuSpy = jest.fn()

    renderWithProviders(
      <ContributeMenu
        showMenu={false}
        setShowMenu={setShowMenuSpy}
        showMobileMenu={false}
        isContributionPageActive={false}
        isUserLoggedIn
        menuItems={menuItems['speak'].items}
        menuLabel="speak"
        menuTooltip="mock-menu-tooltip"
        menuAriaLabel="mock-menu-aria-label"
      />
    )

    fireEvent.click(screen.getByTestId('contribute-menu'))
    expect(setShowMenuSpy).toHaveBeenCalledWith('speak')
  })
})
