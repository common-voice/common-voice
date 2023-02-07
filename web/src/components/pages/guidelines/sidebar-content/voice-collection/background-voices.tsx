import { Localized } from '@fluent/react';
import React from 'react';

import { NAV_IDS } from '../../constants';
import { ExampleContent, ExampleTip } from './example-content';

const exampleTips: ExampleTip[] = [
  {
    text: 'background-voices-example-1',
    icon: 'x',
    explanation: 'background-voices-tip-1',
  },
];

export const BackgoundVoices = () => (
  <div className="sidebar-content" id={NAV_IDS.BACKGROUND_VOICES}>
    <Localized id="background-voices">
      <h3 className="guidelines-content-heading" />
    </Localized>
    <Localized id="background-voices-explanation">
      <p className="guidelines-content-explanation" />
    </Localized>
    <div>
      <Localized id="example">
        <p className="example" />
      </Localized>
      <ExampleContent
        exampleText="background-noise-example-1"
        exampleTips={exampleTips}
      />
      <span className="border" />
    </div>
  </div>
);
