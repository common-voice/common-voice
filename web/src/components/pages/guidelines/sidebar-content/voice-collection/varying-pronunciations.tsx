import { Localized } from '@fluent/react';
import classNames from 'classnames';
import * as React from 'react';

import { ChevronDown } from '../../../../ui/icons';
import { TextButton } from '../../../../ui/ui';
import { SidebarContentProps } from '../../types';

import { ExampleContent, ExampleTip } from './example-content-voice';

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

export const VaryingPronounciation: React.FC<SidebarContentProps> = ({
  id,
  contentVisible,
  toggleVisibleSection,
}) => (
  <div className="sidebar-content" id={id}>
    <span className="line" />
    <div className="sidebar-content-header">
      <Localized id="varying-pronunciations">
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
        </div>
      </div>
    )}
  </div>
);
