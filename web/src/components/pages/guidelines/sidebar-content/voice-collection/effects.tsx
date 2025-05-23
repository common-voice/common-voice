import { Localized } from '@fluent/react';
import classNames from 'classnames';
import * as React from 'react';

import { ChevronDown } from '../../../../ui/icons';
import { TextButton } from '../../../../ui/ui';
import { SidebarContentProps } from '../../types';

export const Effects: React.FC<SidebarContentProps> = ({
  id,
  contentVisible,
  toggleVisibleSection,
  isMobileWidth,
}) => (
  <div className="sidebar-content" id={id}>
    <span className="line" />
    <div className="sidebar-content-header">
      <Localized id="reader-effects">
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
        <Localized id="reader-effects-explanation">
          <p className="guidelines-content-explanation" />
        </Localized>
      </div>
    )}
  </div>
);
