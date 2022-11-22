import * as React from 'react';
import { FirstPostSubmissionCta } from './firstPostSubmissionCTA';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../../../test/render-with-providers';
import { waitFor } from '@testing-library/react';

const mockAccents = jest.fn(() => Promise.resolve({}));
const mockVariants = jest.fn(() => Promise.resolve({}));

jest.mock('../../../../../hooks/store-hooks', () => ({
  useAPI: () => {
    return {
      getAccents: mockAccents,
      getVariants: mockVariants,
    };
  },
  useAction: jest.fn(),
  useLocalStorageState: () => {
    const mockUserLanguages = [{ locale: 'en', accents: [{}] }];
    const mockSetUserLanguages = jest.fn();

    return [mockUserLanguages, mockSetUserLanguages];
  },
}));

describe('FirstPostSubmissionCta', () => {
  it('renders', async () => {
    renderWithProviders(
      <FirstPostSubmissionCta
        locale="en"
        onReset={jest.fn()}
        hideVisibility={jest.fn()}
        addNotification={jest.fn()}
        successUploadMessage="Thanks"
      />
    );

    const thankYouText = 'Thank you for donating your voice clips!';

    await waitFor(async () => {
      expect(screen.getByText(thankYouText)).toBeTruthy();
    });
  });
});
