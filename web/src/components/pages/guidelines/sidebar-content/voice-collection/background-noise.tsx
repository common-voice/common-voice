import { Localized } from '@fluent/react';
import classNames from 'classnames';
import React from 'react';

import { ChevronDown } from '../../../../ui/icons';
import { TextButton } from '../../../../ui/ui';
import { SidebarContentProps } from '../voice-sidebar-content';

import { ExampleContent, ExampleTip } from './example-content-voice';

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

export const BackgoundNoise: React.FC<SidebarContentProps> = ({
  id,
  contentVisible,
  toggleVisibleSection,
}) => (
  <div className="sidebar-content" id={id}>
    <span className="line" />
    <div className="sidebar-content-header">
      <Localized id="background-noise">
        <TextButton
          onClick={toggleVisibleSection}
          className="guidelines-content-heading"
        />
      </Localized>
      <ChevronDown
        onClick={toggleVisibleSection}
        className={classNames('chevron', { 'rotate-180': contentVisible })}
      />
    </div>
    {contentVisible && (
      <div className="content-wrapper">
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
    )}
  </div>
);
