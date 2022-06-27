import * as React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import { act, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '../../../../../test/render-with-providers';

expect.extend(toHaveNoViolations);

import LangugagesRequestFormPage from './request';

jest.mock('../../../../logger');

// mock window.scrollTo
global.scrollTo = jest.fn();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockUseHistoryPush = jest.fn(() => null as any);
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as typeof ReactRouterDom),
  useHistory: () => ({
    push: mockUseHistoryPush,
  }),
}));

const mockSendLanguageRequest = jest.fn(() => Promise.resolve());
jest.mock('../../../../hooks/store-hooks', () => ({
  useAPI: () => ({
    sendLanguageRequest: mockSendLanguageRequest,
  }),
}));

async function fillInForm({
  getByRole,
  getByLabelText,
}: {
  getByRole: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  getByLabelText: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}) {
  // fill in main form
  userEvent.type(getByLabelText(/Your email address/), 'billgates@example.com');
  userEvent.type(
    getByLabelText(/Information about the language/),
    'The language is JavaScript lol!'
  );
  userEvent.click(
    getByLabelText(
      /I'm okay with you handling this info as you explain in Mozilla's Privacy Policy/
    )
  );

  // submit
  await act(async () => {
    await userEvent.click(getByRole('button', { name: 'Submit' }));
  });
}

describe('LanguagesRequestFormPage', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render with no accessibility violations', async () => {
    let renderResult: RenderResult;
    act(() => {
      renderResult = renderWithProviders(<LangugagesRequestFormPage />);
    });
    const results = await axe(renderResult.container);
    expect(results).toHaveNoViolations();
  });

  it('submits valid data', async () => {
    let renderResult: RenderResult;
    act(() => {
      renderResult = renderWithProviders(<LangugagesRequestFormPage />);
    });
    const { getByRole, getByLabelText } = renderResult;

    await fillInForm({ getByRole, getByLabelText });

    // correctly sends email request to server
    await expect(mockSendLanguageRequest).toBeCalledWith({
      email: 'billgates@example.com',
      languageInfo: 'The language is JavaScript lol!',
      languageLocale: 'en-US',
    });

    // redirects to success page
    await expect(mockUseHistoryPush).toBeCalledWith(
      '/en/language/request/success'
    );
  });

  it('shows error if server endpoint errors', async () => {
    mockSendLanguageRequest.mockImplementation(
      jest.fn(() => Promise.reject(new Error('Something Went Wrong')))
    );

    let renderResult: RenderResult;
    act(() => {
      renderResult = renderWithProviders(<LangugagesRequestFormPage />);
    });
    const { getByRole, getByLabelText, queryByText } = renderResult;

    await fillInForm({ getByRole, getByLabelText });

    // no redirect
    await expect(mockUseHistoryPush).not.toBeCalled();

    // showing error message instead
    expect(queryByText(/Sorry, something went wrong/)).toBeTruthy();
  });
});
