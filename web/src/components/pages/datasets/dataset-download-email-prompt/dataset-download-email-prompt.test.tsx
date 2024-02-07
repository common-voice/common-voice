import * as React from 'react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { act, fireEvent, RenderResult } from '@testing-library/react'

import DatasetDownloadEmailPrompt from '.'

import { renderWithProviders } from '../../../../../test/render-with-providers'
import { downloadDataset } from './test-utils'

expect.extend(toHaveNoViolations)

// mock api
const mockGetPublicUrl = jest.fn(() =>
  Promise.resolve({ url: 'https://example.com/fake/url' })
)
const mockSaveHasDownload = jest.fn()
const mockSubscribeToNewsLetter = jest.fn()

jest.mock('../../../../hooks/store-hooks', () => ({
  useAPI: () => {
    return {
      getPublicUrl: mockGetPublicUrl,
      saveHasDownloaded: mockSaveHasDownload,
      subscribeToNewsletter: mockSubscribeToNewsLetter,
    }
  },
  useAction: () => jest.fn(),
}))

const bundleUrlTemplate =
  'cv-corpus-8.0-2022-01-19/cv-corpus-8.0-2022-01-19-{locale}.tar.gz'
const locale = 'en'
const selectedDataset = {
  download_path: bundleUrlTemplate,
  id: 1,
  checksum: 'checksumtest1234',
  size: '100000',
}

afterEach(() => {
  jest.clearAllMocks()
})

describe('DatasetDownloadEmailPrompt', () => {
  it('should render with no accessibility violations', async () => {
    await act(async () => {
      const renderResult: RenderResult = renderWithProviders(
        <DatasetDownloadEmailPrompt
          selectedLocale={locale}
          downloadPath={selectedDataset.download_path}
          releaseId={selectedDataset.id.toString()}
          checksum={selectedDataset.checksum}
          size={selectedDataset.size}
          isSubscribedToMailingList={false}
        />
      )
      const results = await axe(renderResult.container)
      expect(results).toHaveNoViolations()
    })
  })

  it('should render email form with no accessibility violations', async () => {
    await act(async () => {
      const { getByRole, container }: RenderResult = renderWithProviders(
        <DatasetDownloadEmailPrompt
          selectedLocale={locale}
          downloadPath={selectedDataset.download_path}
          releaseId={selectedDataset.id.toString()}
          checksum={selectedDataset.checksum}
          size={selectedDataset.size}
          isSubscribedToMailingList={false}
        />
      )

      fireEvent.click(getByRole('button', { name: 'Enter Email to Download' }))

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  it('should handle bundleURLTemplate strings', async () => {
    await act(async () => {
      renderWithProviders(
        <DatasetDownloadEmailPrompt
          selectedLocale={locale}
          downloadPath={selectedDataset.download_path}
          releaseId={selectedDataset.id.toString()}
          checksum={selectedDataset.checksum}
          size={selectedDataset.size}
          isSubscribedToMailingList={false}
        />
      )
    })

    expect(mockGetPublicUrl).toBeCalledWith(
      'cv-corpus-8.0-2022-01-19%2Fcv-corpus-8.0-2022-01-19-en.tar.gz',
      'dataset'
    )
  })

  it('should allow download if filled in details', async () => {
    const { getByRole, queryByRole, getByLabelText }: RenderResult =
      renderWithProviders(
        <DatasetDownloadEmailPrompt
          selectedLocale={locale}
          downloadPath={selectedDataset.download_path}
          releaseId={selectedDataset.id.toString()}
          checksum={selectedDataset.checksum}
          size={selectedDataset.size}
          isSubscribedToMailingList={false}
        />
      )

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'Enter Email to Download' }))
    })

    downloadDataset({ queryByRole, getByLabelText, getByRole })

    // calls api.saveHasDownloaded correctly
    expect(mockSaveHasDownload).toBeCalledTimes(1)
    expect(mockSaveHasDownload).toBeCalledWith(
      'testemail@example.com',
      'en',
      '1'
    )
  })

  it('should allow download if user is subscribed to mailing list', async () => {
    const {
      getByRole,
      queryByRole,
      getByLabelText,
      queryByLabelText,
    }: RenderResult = renderWithProviders(
      <DatasetDownloadEmailPrompt
        selectedLocale={locale}
        downloadPath={selectedDataset.download_path}
        releaseId={selectedDataset.id.toString()}
        checksum={selectedDataset.checksum}
        size={selectedDataset.size}
        isSubscribedToMailingList
      />
    )

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'Enter Email to Download' }))
    })

    downloadDataset({
      queryByRole,
      getByLabelText,
      getByRole,
      isSubscribedToMailingList: true,
      queryByLabelText,
    })

    // calls api.saveHasDownloaded correctly
    expect(mockSaveHasDownload).toBeCalledTimes(1)
    expect(mockSaveHasDownload).toBeCalledWith(
      'testemail@example.com',
      'en',
      '1'
    )
  })

  it('should still allow download if user decides not to join mailing list', async () => {
    const { getByRole, queryByRole, getByLabelText }: RenderResult =
      renderWithProviders(
        <DatasetDownloadEmailPrompt
          selectedLocale={locale}
          downloadPath={selectedDataset.download_path}
          releaseId={selectedDataset.id.toString()}
          checksum={selectedDataset.checksum}
          size={selectedDataset.size}
          isSubscribedToMailingList={false}
        />
      )

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'Enter Email to Download' }))
    })

    downloadDataset({ queryByRole, getByLabelText, getByRole })

    // calls api.saveHasDownloaded correctly
    expect(mockSaveHasDownload).toBeCalledTimes(1)
    expect(mockSaveHasDownload).toBeCalledWith(
      'testemail@example.com',
      'en',
      '1'
    )
  })

  it('shows the donate modal after download button is clicked', async () => {
    const {
      getByRole,
      getByTestId,
      getByText,
      queryByRole,
      getByLabelText,
    }: RenderResult = renderWithProviders(
      <DatasetDownloadEmailPrompt
        selectedLocale={locale}
        downloadPath={selectedDataset.download_path}
        releaseId={selectedDataset.id.toString()}
        checksum={selectedDataset.checksum}
        size={selectedDataset.size}
        isSubscribedToMailingList={false}
      />
    )

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'Enter Email to Download' }))
    })

    downloadDataset({ queryByRole, getByLabelText, getByRole })

    expect(getByTestId('donate-modal')).toBeTruthy()
    expect(getByText('Did you know…')).toBeTruthy()
  })
})
