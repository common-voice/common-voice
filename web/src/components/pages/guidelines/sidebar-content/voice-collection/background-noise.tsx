import { Localized } from '@fluent/react';
import React from 'react';
import { NAV_IDS } from '../../constants';
import { ExampleContent, ExampleTip } from './example-content';

const exampleTips: ExampleTip[] = [
  { text: 'background-noise-example-1', icon: 'check' },
  {
    text: 'background-noise-example-2',
    icon: 'x',
    explanation: 'background-noise-tip-1',
  },
  {
    text: 'background-noise-example-3',
    icon: 'x',
    explanation: 'background-noise-tip-2',
  },
  {
    text: 'background-noise-example-4',
    icon: 'x',
    explanation: 'background-noise-tip-2',
  },
];

export const BackgoundNoise = () => (
  <div className="sidebar-content" id={NAV_IDS.BACKGROUND_NOISE}>
    <Localized id="background-noise">
      <h3 className="guidelines-content-heading" />
    </Localized>
    <Localized id="background-noise-explanation">
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
