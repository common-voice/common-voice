import * as React from 'react'
import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ContactModal from './contact-modal'
import { renderWithProviders } from '../../../test/render-with-providers'

const mockSendContact = jest.fn()

jest.mock('../../hooks/store-hooks', () => ({
  useAPI: () => ({
    sendContact: mockSendContact,
  }),
}))

const onRequestClose = jest.fn()

afterEach(() => {
  jest.resetAllMocks()
})

async function fillAndSubmit({
  email = 'user@example.com',
  name = '',
  message = 'Hello there!',
} = {}) {
  userEvent.type(screen.getByRole('textbox', { name: /email/i }), email)
  if (name) {
    userEvent.type(screen.getByRole('textbox', { name: /name/i }), name)
  }
  userEvent.type(screen.getByRole('textbox', { name: /message/i }), message)
  await act(async () => {
    userEvent.click(screen.getByTestId('contact-submit-btn'))
  })
}

describe('ContactModal', () => {
  it('renders the form fields', () => {
    renderWithProviders(<ContactModal onRequestClose={onRequestClose} />)
    expect(screen.getByRole('textbox', { name: /email/i })).toBeTruthy()
    expect(screen.getByRole('textbox', { name: /name/i })).toBeTruthy()
    expect(screen.getByRole('textbox', { name: /message/i })).toBeTruthy()
    expect(screen.getByTestId('contact-submit-btn')).toBeTruthy()
  })

  it('calls api.sendContact with form values on submit', async () => {
    mockSendContact.mockResolvedValueOnce({})
    renderWithProviders(<ContactModal onRequestClose={onRequestClose} />)

    await fillAndSubmit({ email: 'user@example.com', name: 'Alice', message: 'Hello!' })

    expect(mockSendContact).toHaveBeenCalledWith({
      email: 'user@example.com',
      name: 'Alice',
      message: 'Hello!',
    })
  })

  it('omits name when left blank', async () => {
    mockSendContact.mockResolvedValueOnce({})
    renderWithProviders(<ContactModal onRequestClose={onRequestClose} />)

    await fillAndSubmit({ email: 'user@example.com', name: '', message: 'Hi' })

    expect(mockSendContact).toHaveBeenCalledWith({
      email: 'user@example.com',
      name: undefined,
      message: 'Hi',
    })
  })

  it('shows success state after submission', async () => {
    mockSendContact.mockResolvedValueOnce({})
    renderWithProviders(<ContactModal onRequestClose={onRequestClose} />)

    await fillAndSubmit()

    expect(screen.queryByTestId('contact-submit-btn')).toBeNull()
  })

  it('shows error message when submission fails', async () => {
    mockSendContact.mockRejectedValueOnce(new Error('Network error'))
    renderWithProviders(<ContactModal onRequestClose={onRequestClose} />)

    await fillAndSubmit()

    expect(screen.getByTestId('contact-form-error')).toBeTruthy()
  })

  it('disables the submit button while submitting', async () => {
    let resolveSubmit: () => void
    mockSendContact.mockReturnValueOnce(
      new Promise<void>(resolve => { resolveSubmit = resolve })
    )
    renderWithProviders(<ContactModal onRequestClose={onRequestClose} />)

    userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'user@example.com')
    userEvent.type(screen.getByRole('textbox', { name: /message/i }), 'Hello!')

    act(() => {
      userEvent.click(screen.getByTestId('contact-submit-btn'))
    })

    expect(screen.getByTestId('contact-submit-btn').hasAttribute('disabled')).toBe(true)

    await act(async () => { resolveSubmit() })
  })
})
