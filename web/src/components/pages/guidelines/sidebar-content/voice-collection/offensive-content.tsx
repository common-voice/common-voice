import { Localized } from '@fluent/react';
import classNames from 'classnames';
import * as React from 'react';

import { ChevronDown } from '../../../../ui/icons';
import { TextButton } from '../../../../ui/ui';
import { SidebarContentProps } from '../../types';

export const OffensiveContent: React.FC<SidebarContentProps> = ({
  id,
  contentVisible,
  toggleVisibleSection,
  isMobileWidth,
}) => {
  return (
    <div className="sidebar-content" id={id}>
      <span className="line" />
      <div className="sidebar-content-header">
        <Localized id="offensive-content">
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
          <Localized
            id="offensive-content-explanation"
            elems={{
              participationGuidelines: (
                <a
                  href="https://www.mozilla.org/en-US/about/governance/policies/participation/"
                  target="_blank"
                  rel="noreferrer"
                />
              ),
              emailFragment: (
                <a
                  href="mailto:commonvoice@mozilla.com"
                  target="_blank"
                  rel="noreferrer"
                />
              ),
            }}>
            <p className="guidelines-content-explanation" />
          </Localized>
        </div>
      )}
    </div>
  );
};
