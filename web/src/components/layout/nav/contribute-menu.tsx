import * as React from 'react';
import classNames from 'classnames';
import { Localized } from '@fluent/react';

import { TextButton } from '../../ui/ui';
import { ChevronDown } from '../../ui/icons';
import { ContributeMenuContent } from './contribute-menu-content';

type ContributeMenuProps = {
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  showMobileMenu: boolean;
  toggleMobileMenuVisible: () => void;
};

export const ContributeMenu: React.FC<ContributeMenuProps> = ({
  showMenu,
  setShowMenu,
  showMobileMenu,
  toggleMobileMenuVisible,
}) => {
  return (
    <div
      className={classNames('contribute-menu', { active: showMenu })}
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
      data-testid="contribute-menu">
      <div className="contribute-btn-wrapper">
        <Localized id="contribute">
          <TextButton
            className="contribute-btn"
            onClick={toggleMobileMenuVisible}
          />
        </Localized>
        <ChevronDown
          className={classNames({ 'rotate-180': showMobileMenu })}
          onClick={toggleMobileMenuVisible}
        />
      </div>
      <div className="contribute-link-wrapper">
        <p className="nav-link-item">
          <Localized id="contribute" />
        </p>
        <ChevronDown className={classNames({ 'rotate-180': showMenu })} />
      </div>
      {showMobileMenu && (
        <div
          className="nav-menu-wrapper-mobile"
          data-testid="contribute-mobile-menu">
          <ContributeMenuContent />
        </div>
      )}
      <div className="nav-menu-wrapper" data-testid="nav-menu-wrapper">
        <div className="menu">
          <span className="blue-border" />
          <ContributeMenuContent className="menu-list" />
        </div>
      </div>
    </div>
  );
};
