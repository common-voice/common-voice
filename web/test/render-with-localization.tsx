import * as React from 'react';
import { render } from '@testing-library/react';

import MockLocalizationProvider from './mock-localization-provider';

export function renderWithLocalization(children: React.ReactNode) {
  return render(
    <MockLocalizationProvider>{children}</MockLocalizationProvider>
  );
}
