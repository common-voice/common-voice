import * as React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { RenderResult } from '@testing-library/react';

import { renderWithLocalization } from '../../../../../test/render-with-localization';

expect.extend(toHaveNoViolations);

import LanguagesRequestSuccessPage from './request-success';

describe('LanguagesRequestSuccessPage', () => {
  it('should render with no accessibility violations', async () => {
    const renderResult: RenderResult = renderWithLocalization(
      <LanguagesRequestSuccessPage />
    );
    const results = await axe(renderResult.container);
    expect(results).toHaveNoViolations();
  });
});
