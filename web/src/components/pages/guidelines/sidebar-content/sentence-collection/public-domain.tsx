import { Localized } from '@fluent/react';
import classNames from 'classnames';
import React from 'react';
import { ChevronDown } from '../../../../ui/icons';
import { TextButton } from '../../../../ui/ui';
import { SidebarContentProps } from '../../types';

export const PublicDomain: React.FC<SidebarContentProps> = ({
  id,
  contentVisible,
  toggleVisibleSection,
}) => {
  return (
    <div className="sidebar-content" id={id}>
      <span className="line" />
      <div className="sidebar-content-header">
        <Localized id="public-domain">
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
          <Localized id="public-domain-explanation-1">
            <p className="guidelines-content-explanation" />
          </Localized>
          <Localized id="public-domain-explanation-2">
            <p className="guidelines-content-explanation" />
          </Localized>
          <ul>
            <Localized id="public-domain-explanation-3">
              <li />
            </Localized>
            <Localized id="public-domain-explanation-4">
              <li />
            </Localized>
            <Localized id="public-domain-explanation-5">
              <li />
            </Localized>
            <Localized id="public-domain-explanation-6">
              <li />
            </Localized>
          </ul>
          <span className="border" />
        </div>
      )}
    </div>
  );
};
