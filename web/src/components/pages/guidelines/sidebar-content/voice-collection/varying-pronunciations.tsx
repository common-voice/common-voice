import { Localized } from '@fluent/react';
import classNames from 'classnames';
import React from 'react';
import { ChevronDown } from '../../../../ui/icons';
import { SidebarContentProps } from '../sidebar-content';

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

export const VaryingPronounciation: React.FC<SidebarContentProps> = ({
  id,
  contentVisible,
  toggleSectionVisible,
}) => (
  <div className="sidebar-content" id={id}>
    <span className="line" />
    <div
      className="sidebar-content-header"
      onClick={() => toggleSectionVisible(id)}
      onKeyDown={() => toggleSectionVisible(id)}
      role="button"
      tabIndex={0}>
      <Localized id="varying-pronunciations">
        <h3 className="guidelines-content-heading" />
      </Localized>
      <ChevronDown
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
          <span className="border" />
        </div>
      </div>
    )}
  </div>
);
