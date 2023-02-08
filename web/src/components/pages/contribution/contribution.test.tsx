import { Localized } from '@fluent/react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import { renderWithProviders } from '../../../../test/render-with-providers';
import ContributionPage, {
  ContributionPageProps,
  ContributionPillProps,
} from './contribution';
import { ReportModalProps } from './report/report';
import RecordingPill from './speak/recording-pill';

const mockAccents = jest.fn(() => Promise.resolve({}));
const mockVariants = jest.fn(() => Promise.resolve({}));

jest.mock('../../../hooks/store-hooks', () => ({
  useAPI: () => {
    return {
      getAccents: mockAccents,
      getVariants: mockVariants,
    };
  },
  useAction: () => jest.fn(),
  useLocalStorageState: () => {
    const mockUserLanguages = [{ locale: 'en', accents: [{}] }];
    const mockSetUserLanguages = jest.fn();

    return [mockUserLanguages, mockSetUserLanguages];
  },
}));

jest.mock('react-confetti', () => ({
  __esModule: true,
  default: () => <div data-testid="confetti">Confetti</div>,
}));

const mockReportModalProps: Omit<ReportModalProps, 'onSubmitted'> = {
  reasons: [
    'offensive-language',
    'grammar-or-spelling',
    'different-language',
    'difficult-pronounce',
  ],
  kind: 'sentence',
  id: 'test-id',
  getString: () => 'test',
};

const mockSentences = [
  { id: 'test-id-1', text: 'Test string text' },
  { id: 'test-id-2', text: 'Another Test string text' },
];

const rerecordIndex: number = null;

const defaultContributionPageProps = {
  demoMode: false,
  activeIndex: 0,
  hasErrors: false,
  reportModalProps: mockReportModalProps,
  instruction: () => <div>Test instructions</div>,
  isPlaying: false,
  isSubmitted: false,
  onReset: jest.fn(),
  onSkip: jest.fn(),
  primaryButtons: <button>Test button</button>,
  // eslint-disable-next-line react/display-name
  pills: [].map((clip, i) => (props: ContributionPillProps) => (
    <RecordingPill
      {...props}
      clip={clip}
      status="pending"
      onRerecord={jest.fn()}>
      {rerecordIndex === i && (
        <Localized id="record-cancel">
          <button onClick={jest.fn()} className="text" />
        </Localized>
      )}
    </RecordingPill>
  )),
  sentences: mockSentences,
  shortcuts: [
    {
      key: 'shortcut-record-toggle',
      label: 'shortcut-record-toggle-label',
      action: jest.fn(),
    },
  ],
  type: 'speak' as ContributionPageProps['type'],
};

const renderContributionPage = (
  overrideProps?: Partial<ContributionPageProps>
) =>
  renderWithProviders(
    <ContributionPage {...defaultContributionPageProps} {...overrideProps} />
  );

describe('Contribution - Speak', () => {
  it('renders Contribution page', () => {
    renderContributionPage();

    expect(screen.getByText('Test string text')).toBeTruthy();
    expect(screen.getByText('Speak')).toBeTruthy();
  });

  it('submits clips', () => {
    const mockOnSubmit = jest.fn();

    renderContributionPage({
      activeIndex: -1,
      onSubmit: mockOnSubmit,
      onPrivacyAgreedChange: jest.fn(),
    });

    const form = screen.getByTestId('speak-submit-form');
    const checkbox = screen.getByTestId('checkbox');

    fireEvent.click(checkbox);
    fireEvent.submit(form);
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('renders first CTA', async () => {
    const mockOnReset = jest.fn();

    renderContributionPage({
      activeIndex: -1,
      shouldShowFirstCTA: true,
      onReset: mockOnReset,
    });

    const thankYouText = 'Thank you for donating your voice clips!';

    await waitFor(async () => {
      expect(screen.getByText(thankYouText)).toBeTruthy();
      expect(screen.getByTestId('first-submission-cta')).toBeTruthy();

      const addInformationButton = screen.getByTestId('add-information-button');

      fireEvent.click(addInformationButton);
      expect(mockOnReset).toHaveBeenCalled();
    });
  });

  it('renders second CTA', () => {
    const mockOnReset = jest.fn();

    renderContributionPage({
      activeIndex: -1,
      shouldShowSecondCTA: true,
      onReset: mockOnReset,
    });

    const secondCTAWrapper = screen.getByTestId('second-submission-cta');
    const confetti = screen.getByTestId('confetti');
    const continueButton = screen.getByTestId('continue-speaking-button');

    const thankYouText = 'Thank you for contributing your voice!';

    expect(secondCTAWrapper).toBeTruthy();
    expect(screen.getByText(thankYouText)).toBeTruthy();
    expect(confetti).toBeTruthy();

    fireEvent.click(continueButton);
    expect(mockOnReset).toHaveBeenCalled();
  });
});
