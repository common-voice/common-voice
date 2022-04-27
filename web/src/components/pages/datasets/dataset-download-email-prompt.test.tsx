import * as React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { act, fireEvent, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithLocalization } from '../../../../test/render-with-localization';

import DatasetDownloadEmailPrompt from './dataset-download-email-prompt';

// import { CURRENT_RELEASE_ID } from './releases';
const CURRENT_RELEASE_ID = 'cv-corpus-8.0-2022-01-19';

expect.extend(toHaveNoViolations);

// mock api
const mockGetPublicUrl = jest.fn(() =>
  Promise.resolve({ url: 'https://example.com/fake/url' })
);
const mockSaveHasDownload = jest.fn();
jest.mock('../../../hooks/store-hooks', () => ({
  useAPI: () => {
    return {
      getPublicUrl: mockGetPublicUrl,
      saveHasDownloaded: mockSaveHasDownload,
    };
  },
}));

const bundleUrlTemplate =
  'cv-corpus-8.0-2022-01-19/cv-corpus-8.0-2022-01-19-{locale}.tar.gz';

const bundleState = {
  bundleLocale: 'en',
  checksum: 'd00f7dc59f890def0cc228ce6d9aa9b82553fdc9e0c7da05717776527c9aa809',
  size: '50 GB',
  language: 'English',
  totalHours: 10,
  validHours: 20,
  rawSize: 10,
  releaseId: CURRENT_RELEASE_ID,
};

describe('DatasetDownloadEmailPrompt', () => {
  it('should render with no accessibility violations', async () => {
    await act(async () => {
      const renderResult: RenderResult = renderWithLocalization(
        <DatasetDownloadEmailPrompt
          urlPattern={bundleUrlTemplate}
          bundleState={bundleState}
        />
      );
      const results = await axe(renderResult.container);
      expect(results).toHaveNoViolations();
    });
  });

  it('should render email form with no accessibility violations', async () => {
    await act(async () => {
      const { getByRole, container }: RenderResult = renderWithLocalization(
        <DatasetDownloadEmailPrompt
          urlPattern={bundleUrlTemplate}
          bundleState={bundleState}
        />
      );

      fireEvent.click(getByRole('button', { name: 'Enter Email to Download' }));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  it('should handle bundleURLTemplate strings', async () => {
    await act(async () => {
      renderWithLocalization(
        <DatasetDownloadEmailPrompt
          urlPattern={bundleUrlTemplate}
          bundleState={bundleState}
        />
      );
    });

    expect(mockGetPublicUrl).toBeCalledWith(
      'cv-corpus-8.0-2022-01-19%2Fcv-corpus-8.0-2022-01-19-en.tar.gz',
      'dataset'
    );
  });

  it('should allow download if filled in details', async () => {
    const { getByRole, queryByRole, getByLabelText }: RenderResult =
      renderWithLocalization(
        <DatasetDownloadEmailPrompt
          urlPattern={bundleUrlTemplate}
          bundleState={bundleState}
        />
      );

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'Enter Email to Download' }));
    });

    // check the download link is disabled
    const disabledDownloadLink = queryByRole('link', {
      name: /Download English/,
    });
    expect(disabledDownloadLink).toBeNull(); // not exist as a link

    // type in email address
    await userEvent.type(getByLabelText(/Email/), 'billgates@example.com');

    // check the checkboxes
    userEvent.click(
      getByLabelText(/You are prepared to initiate a download of 50 GB/)
    );
    userEvent.click(getByLabelText(/You agree to not attempt to determine/));

    // now has the link
    const downloadLink = getByRole('link', { name: /Download English/ });
    await expect(downloadLink.getAttribute('href')).toBe(
      'https://example.com/fake/url'
    );

    // click link
    fireEvent.click(downloadLink);

    // calls api.saveHasDownloaded correctly
    expect(mockSaveHasDownload).toBeCalledTimes(1);
    expect(mockSaveHasDownload).toBeCalledWith(
      'billgates@example.com',
      'en',
      'cv-corpus-8.0-2022-01-19'
    );
  });
});
