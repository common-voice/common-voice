import { Localized } from '@fluent/react';
import classNames from 'classnames';
import React from 'react';

import { ChevronDown } from '../../../../ui/icons';
import { SidebarContentProps } from '../voice-sidebar-content';

export const Volume: React.FC<SidebarContentProps> = ({
  id,
  contentVisible,
  toggleSectionVisible,
}) => (
  <div className="sidebar-content" id={id}>
    <span className="line" />
    <div className="sidebar-content-header">
      <Localized id="volume">
        <h3 className="guidelines-content-heading" />
      </Localized>
      <ChevronDown
        onClick={toggleSectionVisible}
        className={classNames('chevron', { 'rotate-180': contentVisible })}
      />
    </div>
    {contentVisible && (
      <div className="content-wrapper">
        <Localized id="volume-explanation">
          <p className="guidelines-content-explanation" />
        </Localized>
        <span className="border" />
      </div>
    )}
  </div>
);
