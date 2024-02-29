import * as React from 'react';
import { screen } from '@testing-library/react';

import Guidelines from './guidelines';
import { renderWithProviders } from '../../../../test/render-with-providers';

describe('Guidelines page', () => {
  it('renders Guidelines page', () => {
    renderWithProviders(<Guidelines />);

    expect(screen.getByTestId('guidelines-page')).toBeDefined();

    const guidelinesHeading = screen.getByText('Contribution Guidelines');
    expect(guidelinesHeading).toBeDefined();

    const voiceCollectionTab = screen.getByText('Voice Collection');
    const sentenceCollectionTab = screen.getByText('Sentence Collection');

    expect(voiceCollectionTab).toBeDefined();
    expect(sentenceCollectionTab).toBeDefined();
  });
});
