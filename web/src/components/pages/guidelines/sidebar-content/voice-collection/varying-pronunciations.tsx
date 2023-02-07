import { Localized } from '@fluent/react';
import React from 'react';

import { NAV_IDS } from '../../constants';
import { ExampleContent, ExampleTip } from './example-content';

const exampleTips: ExampleTip[] = [
  {
    text: 'varying-pronunciations-example',
    icon: 'check',
    explanation: 'varying-pronunciations-tip-1',
  },
  {
    text: 'varying-pronunciations-example',
    icon: 'check',
    explanation: 'varying-pronunciations-tip-2',
  },
];

export const VaryingPronounciation = () => (
  <div className="sidebar-content" id={NAV_IDS.PRONUNCIATIONS}>
    <Localized id="varying-pronunciations">
      <h3 className="guidelines-content-heading" />
    </Localized>
    <Localized id="varying-pronunciations-explanation-1">
      <p className="guidelines-content-explanation" />
    </Localized>
    <Localized id="varying-pronunciations-explanation-2">
      <p className="guidelines-content-explanation" />
    </Localized>
    <div>
      <Localized id="example">
        <p className="example" />
      </Localized>
      <ExampleContent
        exampleText="varying-pronunciations-example"
        exampleTips={exampleTips}
      />
      <span className="border" />
    </div>
  </div>
);
