import * as React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { RenderResult } from '@testing-library/react';
import { Localized } from '@fluent/react';

import { renderWithLocalization } from '../../../test/render-with-localization';

import ExpandableInformation from './expandable-information';

expect.extend(toHaveNoViolations);

describe('InputLanguageVariant', () => {
  it('should render with no accessibility violations', async () => {
    const renderResult: RenderResult = renderWithLocalization(
      <ExpandableInformation summaryLocalizedId="help-accent">
        <Localized id="help-accent-explanation">
          <div />
        </Localized>
      </ExpandableInformation>
    );
    const results = await axe(renderResult.container);
    expect(results).toHaveNoViolations();
  });
});
