import * as React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { act, fireEvent, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithLocalization } from '../../../../test/render-with-localization';

import DatasetDownloadEmailPrompt from './dataset-download-email-prompt';

expect.extend(toHaveNoViolations);

// mock api
const mockGetPublicUrl = jest.fn(() =>
  Promise.resolve({ url: 'https://example.com/fake/url' })
);
const mockSaveHasDownload = jest.fn();
const mockSubscribeToNewsLetter = jest.fn();

jest.mock('../../../hooks/store-hooks', () => ({
  useAPI: () => {
    return {
      getPublicUrl: mockGetPublicUrl,
      saveHasDownloaded: mockSaveHasDownload,
      subscribeToNewsletter: mockSubscribeToNewsLetter,
    };
  },
  useAction: () => jest.fn(),
}));

const bundleUrlTemplate =
  'cv-corpus-8.0-2022-01-19/cv-corpus-8.0-2022-01-19-{locale}.tar.gz';
const locale = 'en';
const selectedDataset = {
  download_path: bundleUrlTemplate,
  id: 1,
  checksum: 'checksumtest1234',
  size: '100000',
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('DatasetDownloadEmailPrompt', () => {
  it('should render with no accessibility violations', async () => {
    await act(async () => {
      const renderResult: RenderResult = renderWithLocalization(
        <DatasetDownloadEmailPrompt
          selectedLocale={locale}
          downloadPath={selectedDataset.download_path}
          releaseId={selectedDataset.id.toString()}
          checksum={selectedDataset.checksum}
          size={selectedDataset.size}
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
          selectedLocale={locale}
          downloadPath={selectedDataset.download_path}
          releaseId={selectedDataset.id.toString()}
          checksum={selectedDataset.checksum}
          size={selectedDataset.size}
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
          selectedLocale={locale}
          downloadPath={selectedDataset.download_path}
          releaseId={selectedDataset.id.toString()}
          checksum={selectedDataset.checksum}
          size={selectedDataset.size}
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
          selectedLocale={locale}
          downloadPath={selectedDataset.download_path}
          releaseId={selectedDataset.id.toString()}
          checksum={selectedDataset.checksum}
          size={selectedDataset.size}
        />
      );

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'Enter Email to Download' }));
    });

    // check the download link is disabled
    const disabledDownloadLink = queryByRole('link', {
      name: /Enter Email to Download/,
    });
    expect(disabledDownloadLink).toBeNull(); // not exist as a link

    // type in email address
    userEvent.type(getByLabelText(/Email/), 'testemail@example.com');

    // check the checkboxes
    userEvent.click(
      getByLabelText(/You are prepared to initiate a download of /)
    );

    userEvent.click(getByLabelText(/You agree to not attempt to determine/));

    userEvent.click(
      getByLabelText(/I want to join the Common Voice mailing list/)
    );

    // now has the link
    const downloadLink = getByRole('button', {
      name: /Download Dataset Bundle/,
    });

    expect(downloadLink.getAttribute('href')).toBe(
      'https://example.com/fake/url'
    );

    // click link
    fireEvent.click(downloadLink);

    // calls api.saveHasDownloaded correctly
    expect(mockSaveHasDownload).toBeCalledTimes(1);
    expect(mockSaveHasDownload).toBeCalledWith(
      'testemail@example.com',
      'en',
      '1'
    );
  });

  it('should still allow download if user decides not to join mailing list', async () => {
    const { getByRole, queryByRole, getByLabelText }: RenderResult =
      renderWithLocalization(
        <DatasetDownloadEmailPrompt
          selectedLocale={locale}
          downloadPath={selectedDataset.download_path}
          releaseId={selectedDataset.id.toString()}
          checksum={selectedDataset.checksum}
          size={selectedDataset.size}
        />
      );

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'Enter Email to Download' }));
    });

    // check the download link is disabled
    const disabledDownloadLink = queryByRole('link', {
      name: /Enter Email to Download/,
    });
    expect(disabledDownloadLink).toBeNull(); // not exist as a link

    // type in email address
    userEvent.type(getByLabelText(/Email/), 'testemail@example.com');

    // check the checkboxes
    userEvent.click(
      getByLabelText(/You are prepared to initiate a download of /)
    );

    userEvent.click(getByLabelText(/You agree to not attempt to determine/));

    // assert that checkbox is visible but don't click it
    expect(
      getByLabelText(/I want to join the Common Voice mailing list/)
    ).toBeDefined();

    // now has the link
    const downloadLink = getByRole('button', {
      name: /Download Dataset Bundle/,
    });

    expect(downloadLink.getAttribute('href')).toBe(
      'https://example.com/fake/url'
    );

    // click link
    fireEvent.click(downloadLink);

    // calls api.saveHasDownloaded correctly
    expect(mockSaveHasDownload).toBeCalledTimes(1);
    expect(mockSaveHasDownload).toBeCalledWith(
      'testemail@example.com',
      'en',
      '1'
    );
  });
});
