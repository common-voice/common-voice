import { Localized } from '@fluent/react';
import classNames from 'classnames';
import * as React from 'react';

import { ChevronDown } from '../../../../ui/icons';
import { TextButton } from '../../../../ui/ui';
import { SidebarContentProps } from '../../types';

import { ExampleContent, ExampleTip } from './example-content-voice';

const exampleTips: ExampleTip[] = [
  { text: 'misreadings-example-1', icon: 'check' },
  {
    text: 'misreadings-example-2',
    icon: 'x',
    explanation: 'misreadings-tip-1',
  },
  {
    text: 'misreadings-example-3',
    icon: 'x',
    explanation: 'misreadings-tip-2',
  },
  {
    text: 'misreadings-example-4',
    icon: 'x',
    explanation: 'misreadings-tip-3',
  },
];

export const Misreadings: React.FC<SidebarContentProps> = ({
  id,
  contentVisible,
  toggleVisibleSection,
}) => (
  <div className="sidebar-content" id={id}>
    <span className="line" />
    <div className="sidebar-content-header">
      <Localized id="misreadings">
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
        <Localized id="misreadings-explanation-1">
          <p className="guidelines-content-explanation" />
        </Localized>
        <Localized id="misreadings-explanation-2">
          <p className="guidelines-content-explanation" />
        </Localized>
        <ul>
          <Localized id="misreadings-explanation-3">
            <li />
          </Localized>
          <Localized id="misreadings-explanation-4">
            <li />
          </Localized>
          <Localized id="misreadings-explanation-5">
            <li />
          </Localized>
          <Localized id="misreadings-explanation-6">
            <li />
          </Localized>
          <Localized id="misreadings-explanation-7">
            <li />
          </Localized>
        </ul>
        <div>
          <Localized id="example">
            <p className="example" />
          </Localized>
          <ExampleContent
            exampleText="misreadings-example-1"
            exampleTips={exampleTips}
          />
        </div>
        <span className="border" />
      </div>
    )}
  </div>
);
