import { Localized } from '@fluent/react';
import classNames from 'classnames';
import * as React from 'react';

import { ChevronDown } from '../../../../ui/icons';
import { TextButton } from '../../../../ui/ui';
import { SidebarContentProps } from '../../types';

export const Volume: React.FC<SidebarContentProps> = ({
  id,
  contentVisible,
  toggleVisibleSection,
}) => (
  <div className="sidebar-content" id={id}>
    <span className="line" />
    <div className="sidebar-content-header">
      <Localized id="volume">
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
        <Localized id="volume-explanation">
          <p className="guidelines-content-explanation" />
        </Localized>
      </div>
    )}
  </div>
);
