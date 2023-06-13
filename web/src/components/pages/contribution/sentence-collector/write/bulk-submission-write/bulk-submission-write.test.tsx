import * as React from 'react'
import { screen } from '@testing-library/react'

import { renderWithProviders } from '../../../../../../../test/render-with-providers'
import BulkSubmissionWrite from './bulk-submission-write'

describe('Bulk submission page', () => {
  it('renders the Upload dropzone', () => {
    renderWithProviders(<BulkSubmissionWrite />)

    expect(screen.getByTestId('bulk-upload-dropzone')).toBeTruthy()
  })
})
