import * as React from 'react'
import { act, fireEvent, screen, waitFor } from '@testing-library/react'

import { renderWithProviders } from '../../../../../../../test/render-with-providers'
import BulkSubmissionWrite from './bulk-submission-write'
import * as useBulkSubmissionUploadModule from '../../../../../../hooks/use-bulk-submission-upload'

const files = [
  new File(['(⌐□_□)'], 'test-bulk-submission.tsv', {
    type: 'text/tab-separated-values',
  }),
]

const createEvent = (name: string) => {
  const event = new Event(name, { bubbles: true })

  Object.assign(event, {
    dataTransfer: {
      files,
      items: files.map(f => ({
        kind: 'file',
        type: f.type,
        getAsFile: () => f,
      })),
      types: ['Files'],
    },
  })

  return event
}

const baseUseBulkFileUploadMock: ReturnType<
  typeof useBulkSubmissionUploadModule.default
> = {
  handleDrop: jest.fn(),
  uploadStatus: 'off',
  fileInfo: {
    name: 'test-file.tsv',
    size: 129,
    lastModified: new Date().toDateString(),
  },
  abortBulkSubmissionRequest: jest.fn(),
  startUpload: jest.fn(),
  removeBulkSubmission: jest.fn(),
  fileRejections: [],
}

afterEach(() => {
  jest.clearAllMocks()
})

describe('Bulk submission page', () => {
  it('renders the Upload dropzone', () => {
    renderWithProviders(<BulkSubmissionWrite />)

    expect(screen.getByTestId('bulk-upload-dropzone')).toBeTruthy()
    expect(screen.getByTestId('upload-dropzone-instruction')).toBeTruthy()
  })

  it('handles drag and drop', async () => {
    renderWithProviders(<BulkSubmissionWrite />)

    const uploadDropzone = screen.getByTestId('file-input')

    await act(() =>
      waitFor(() => {
        fireEvent(uploadDropzone, createEvent('dragenter'))
      })
    )

    // Assert that the dropzone content changes when files are dragged
    expect(screen.getByText('Drop file here to upload')).toBeTruthy()

    await act(() =>
      waitFor(() => {
        fireEvent(uploadDropzone, createEvent('drop'))
      })
    )

    // Asert that the filename appears in the dropzone
    expect(screen.getByText('test-bulk-submission.tsv')).toBeTruthy()
  })

  it('handles file upload', async () => {
    const startUploadMock = jest.fn()
    jest
      .spyOn(useBulkSubmissionUploadModule, 'default')
      .mockImplementation(() => ({
        ...baseUseBulkFileUploadMock,
        uploadStatus: 'waiting',
        fileInfo: {
          name: files[0].name,
          size: files[0].size,
          lastModified: files[0].lastModified.toLocaleString(),
        },
        startUpload: startUploadMock,
      }))

    renderWithProviders(<BulkSubmissionWrite />)

    const checkBox = screen.getByTestId('public-domain-checkbox')

    fireEvent.click(checkBox)

    const submitButton = screen.getByTestId('submit-button')

    act(() => {
      fireEvent.click(submitButton)
    })

    expect(startUploadMock).toHaveBeenCalled()
  })
})
