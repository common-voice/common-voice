import { Localized } from '@fluent/react';
import classNames from 'classnames';
import React from 'react';
import { ChevronDown } from '../../../../ui/icons';
import { TextButton } from '../../../../ui/ui';
import { SidebarContentProps } from '../voice-sidebar-content';

import ExampleContentSentence from './example-content-sentence';

export const CitingSentences: React.FC<SidebarContentProps> = ({
  id,
  contentVisible,
  toggleVisibleSection,
}) => {
  return (
    <div className="sidebar-content" id={id}>
      <span className="line" />
      <div className="sidebar-content-header">
        <Localized id="citing-sentences">
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
          <Localized id="citing-sentences-explanation-1">
            <p className="guidelines-content-explanation" />
          </Localized>
          <Localized id="citing-sentences-subheader-websites">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized id="citing-sentences-subheader-websites-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>
          <Localized id="citing-sentences-subheader-academic-reference">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized id="citing-sentences-subheader-academic-reference-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>
          <Localized id="citing-sentences-subheader-offline-sources">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized id="citing-sentences-subheader-offline-sources-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>
          <div>
            <Localized id="example">
              <p className="example" />
            </Localized>
            <ExampleContentSentence contentType="cite" />
          </div>
          <span className="border" />
        </div>
      )}
    </div>
  );
};
