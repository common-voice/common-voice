import * as React from 'react'
import { fireEvent, screen } from '@testing-library/react'

import ContributeMenu from '.'
import { renderWithProviders } from '../../../../../test/render-with-providers'

describe('Contribute Menu Test', () => {
  it('renders Contribute Menu', async () => {
    renderWithProviders(
      <ContributeMenu
        showMenu={false}
        setShowMenu={jest.fn()}
        showMobileMenu={false}
        toggleMobileMenuVisible={jest.fn()}
        isContributionPageActive={false}
        isUserLoggedIn
      />
    )

    expect(screen.queryByTestId('contribute-menu')).toBeTruthy()
    expect(await screen.findByText('Speak')).toBeTruthy()
    expect(await screen.findByText('Listen')).toBeTruthy()
    expect(await screen.findByText('Write')).toBeTruthy()
  })

  it('shows the menu on hover', () => {
    const setShowMenuSpy = jest.fn()

    renderWithProviders(
      <ContributeMenu
        showMenu={false}
        setShowMenu={setShowMenuSpy}
        showMobileMenu={false}
        toggleMobileMenuVisible={jest.fn()}
        isContributionPageActive={false}
        isUserLoggedIn
      />
    )

    fireEvent.mouseEnter(screen.getByTestId('contribute-menu'))
    expect(setShowMenuSpy).toHaveBeenCalledWith(true)
  })

  it('does not show the menu on hover if a contribution page is active', () => {
    const setShowMenuSpy = jest.fn()

    renderWithProviders(
      <ContributeMenu
        showMenu={false}
        setShowMenu={setShowMenuSpy}
        showMobileMenu={false}
        toggleMobileMenuVisible={jest.fn()}
        isContributionPageActive
        isUserLoggedIn
      />
    )

    fireEvent.mouseEnter(screen.getByTestId('contribute-menu'))
    expect(setShowMenuSpy).not.toHaveBeenCalled()
  })
})
