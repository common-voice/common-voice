import * as React from 'react';
import { SecondPostSubmissionCTA } from './secondSubmissionCTA';
import { renderWithProviders } from '../../../../../../test/render-with-providers';
import { fireEvent, screen } from '@testing-library/react';

jest.mock('react-confetti', () => ({
  __esModule: true,
  default: () => <div data-testid="confetti">Confetti</div>,
}));

describe('SecondPostSubmissionCta', () => {
  it('renders', () => {
    const mockOnReset = jest.fn();

    renderWithProviders(<SecondPostSubmissionCTA onReset={mockOnReset} />);

    const confetti = screen.getByTestId('confetti');
    const continueButton = screen.getByTestId('continue-speaking-button');

    const thankYouText = 'Thank you for contributing your voice!';

    expect(screen.getByText(thankYouText)).toBeTruthy();
    expect(confetti).toBeTruthy();

    fireEvent.click(continueButton);
    expect(mockOnReset).toHaveBeenCalled();
  });
});
