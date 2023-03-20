import { Localized } from '@fluent/react';
import classNames from 'classnames';
import * as React from 'react';

import { ChevronDown } from '../../../../ui/icons';
import { TextButton } from '../../../../ui/ui';
import { SidebarContentProps } from '../../types';

import { ExampleContent, ExampleTip } from './example-content-voice';

const exampleTips: ExampleTip[] = [
  {
    text: 'background-voices-example-1',
    icon: 'x',
    explanation: 'background-voices-tip-1',
  },
];

export const BackgoundVoices: React.FC<SidebarContentProps> = ({
  id,
  contentVisible,
  toggleVisibleSection,
  isMobileWidth,
}) => (
  <div className="sidebar-content" id={id}>
    <span className="line" />
    <div className="sidebar-content-header">
      <Localized id="background-voices">
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
    {(contentVisible || !isMobileWidth) && (
      <div className="content-wrapper">
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
        </div>
      </div>
    )}
  </div>
);
