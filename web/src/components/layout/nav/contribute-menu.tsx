import * as React from 'react';
import classNames from 'classnames';
import { Localized } from '@fluent/react';
import { RouteComponentProps, withRouter } from 'react-router';

import { TextButton } from '../../ui/ui';
import { ChevronDown } from '../../ui/icons';
import { ContributeMenuContent } from './contribute-menu-content';

interface ContributeMenuProps extends RouteComponentProps {
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  showMobileMenu: boolean;
  toggleMobileMenuVisible: () => void;
  isContributionPageActive: boolean;
}

const ContributeMenu: React.FC<ContributeMenuProps> = ({
  showMenu,
  setShowMenu,
  showMobileMenu,
  toggleMobileMenuVisible,
  isContributionPageActive,
  location,
}) => {
  const handleMouseEnter = () => {
    if (!isContributionPageActive) {
      setShowMenu(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isContributionPageActive) {
      setShowMenu(false);
    }
  };

  return (
    <div>
      <div id="contribute-btn-wrapper">
        <Localized id="contribute">
          <TextButton
            className="contribute-btn"
            onClick={toggleMobileMenuVisible}
          />
        </Localized>
        {!isContributionPageActive && (
          <ChevronDown
            className={classNames({ 'rotate-180': showMobileMenu })}
            onClick={toggleMobileMenuVisible}
          />
        )}
        {isContributionPageActive && <span className="black-border" />}
      </div>
      <div
        className={classNames('contribute-menu', {
          active: showMenu,
          'contribution-page-active': isContributionPageActive,
        })}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-testid="contribute-menu">
        <div className="contribute-links-wrapper">
          <p className="nav-link-item">
            <Localized id="contribute" />
          </p>
          {!isContributionPageActive && (
            <ChevronDown className={classNames({ 'rotate-180': showMenu })} />
          )}
        </div>
        {(showMobileMenu || isContributionPageActive) && (
          <div
            className="menu-wrapper-mobile"
            data-testid="contribute-mobile-menu">
            <ContributeMenuContent pathname={location.pathname} />
          </div>
        )}
        <div className="menu-wrapper" data-testid="menu-wrapper">
          {isContributionPageActive && <span className="black-border" />}
          <div className="menu">
            <span className="blue-border" />
            <ContributeMenuContent className="menu-list" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(ContributeMenu);
