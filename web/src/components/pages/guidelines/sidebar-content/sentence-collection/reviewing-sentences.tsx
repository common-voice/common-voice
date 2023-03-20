import { Localized } from '@fluent/react';
import classNames from 'classnames';
import * as React from 'react';

import { ChevronDown } from '../../../../ui/icons';
import { TextButton } from '../../../../ui/ui';
import { SidebarContentProps } from '../../types';
import ExampleContentSentence from './example-content-sentence';

export const ReviewingSentences: React.FC<SidebarContentProps> = ({
  id,
  contentVisible,
  toggleVisibleSection,
  isMobileWidth,
}) => {
  return (
    <div className="sidebar-content" id={id}>
      <span className="line" />
      <div className="sidebar-content-header">
        <Localized id="reviewing-sentences">
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
          <ul>
            <Localized id="reviewing-sentences-explanation-1">
              <li />
            </Localized>
            <Localized id="reviewing-sentences-explanation-2">
              <li />
            </Localized>
            <Localized id="reviewing-sentences-explanation-3">
              <li />
            </Localized>
            <Localized id="reviewing-sentences-explanation-4">
              <li />
            </Localized>
          </ul>
          <div>
            <Localized id="example">
              <p className="example" />
            </Localized>
            <ExampleContentSentence contentType="review" />
          </div>
        </div>
      )}
    </div>
  );
};
