import * as React from 'react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { waitFor, render, cleanup } from '@testing-library/react'

import ContributionActivity from './contribution-activity'

expect.extend(toHaveNoViolations)

// mock components
jest.mock('../../../plot/plot', () => ({
  BarPlot: () => {
    return <div></div>
  },
}))

// mock api
const mockFetchContributionActivity = jest.fn(() => Promise.resolve([]))
const mockAPI = {
  fetchContributionActivity: mockFetchContributionActivity,
}
jest.mock('../../../../hooks/store-hooks', () => ({
  useAPI: () => mockAPI,
}))

describe('ContributionActivity', () => {
  beforeEach(() => {
    mockFetchContributionActivity.mockClear()
  })

  afterEach(() => {
    cleanup()
  })

  it('should render with no accessibility violations', async () => {
    const renderResult = render(<ContributionActivity from="you" locale="en" />)

    await waitFor(() =>
      expect(mockFetchContributionActivity).toHaveBeenCalled()
    )

    const results = await axe(renderResult.container)
    expect(results).toHaveNoViolations()
  })

  it('should call the api when props change', async () => {
    const { rerender } = render(<ContributionActivity from="you" locale="en" />)

    await waitFor(() =>
      expect(mockFetchContributionActivity).toBeCalledWith('you', 'en')
    )

    // we change tab and update the props
    rerender(<ContributionActivity from="everyone" locale="en" />)

    await waitFor(() =>
      expect(mockFetchContributionActivity).toBeCalledWith('everyone', 'en')
    )
  })
})
