import * as React from 'react'
import { screen } from '@testing-library/react'

import Nav from './nav'
import { renderWithProviders } from '../../../../test/render-with-providers'

describe('Nav test', () => {
  it('renders the Nav component', () => {
    renderWithProviders(<Nav shouldExpandNavItems />)

    expect(screen.getAllByText('Speak')).toBeTruthy()
    expect(screen.getAllByText('Listen')).toBeTruthy()
    expect(screen.getAllByText('Write')).toBeTruthy()
    expect(screen.getAllByText('Download')).toBeTruthy()
    expect(screen.getAllByText('About')).toBeTruthy()
  })
})
