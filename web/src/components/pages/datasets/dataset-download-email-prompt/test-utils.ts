import {
  ByRoleMatcher,
  ByRoleOptions,
  Matcher,
  SelectorMatcherOptions,
  fireEvent,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

type DownloadDatasetParams = {
  queryByRole: (role: ByRoleMatcher, options?: ByRoleOptions) => HTMLElement
  getByLabelText: (id: Matcher, options?: SelectorMatcherOptions) => HTMLElement
  getByRole: (role: ByRoleMatcher, options?: ByRoleOptions) => HTMLElement
  isSubscribedToMailingList?: boolean
  queryByLabelText?: (
    id: Matcher,
    options?: SelectorMatcherOptions
  ) => HTMLElement
}

export const downloadDataset = ({
  queryByRole,
  getByLabelText,
  getByRole,
  isSubscribedToMailingList = false,
  queryByLabelText,
}: DownloadDatasetParams) => {
  // check the download link is disabled
  const disabledDownloadLink = queryByRole('link', {
    name: /Enter Email to Download/,
  })
  expect(disabledDownloadLink).toBeNull() // not exist as a link

  // type in email address
  userEvent.type(getByLabelText(/Email/), 'testemail@example.com')

  // check the checkboxes
  userEvent.click(getByLabelText(/You are prepared to initiate a download of /))

  userEvent.click(getByLabelText(/You agree to not attempt to determine/))

  if (!isSubscribedToMailingList) {
    userEvent.click(
      getByLabelText(/You want to join the Common Voice mailing list/)
    )
  } else {
    expect(
      queryByLabelText(/You want to join the Common Voice mailing list/)
    ).toBeNull()
  }

  // now has the link
  const downloadLink = getByRole('button', {
    name: /Download Dataset Bundle/,
  })

  expect(downloadLink.getAttribute('href')).toBe('https://example.com/fake/url')

  // click link
  fireEvent.click(downloadLink)
}
