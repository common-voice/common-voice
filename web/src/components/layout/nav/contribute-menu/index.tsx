import * as React from 'react'
import classNames from 'classnames'
import { Localized } from '@fluent/react'
import { RouteComponentProps, withRouter } from 'react-router'

import { TextButton } from '../../../ui/ui'
import { ChevronDown } from '../../../ui/icons'
import ContributeMenuContent from '../contribute-menu-content'

import { LocalizedNavLink, NavItem } from '../nav'
import URLS from '../../../../urls'

import './contribute-menu.css'

export type ContributeMenuItem = {
  localizedId: string
  href?: string
  icon: React.ComponentType
  requiresAuth?: boolean
}

export type MenuConfig = {
  items: ContributeMenuItem[]
  renderContributableLocaleLock?: boolean
}

interface ContributeMenuProps extends RouteComponentProps {
  showMenu: boolean
  setShowMenu: (navItem: NavItem) => void
  showMobileMenu: boolean
  toggleMobileMenuVisible: () => void
  isContributionPageActive: boolean
  isUserLoggedIn: boolean
  menuItems: ContributeMenuItem[]
  menuLabel: NavItem
}

const ContributeMenu: React.FC<ContributeMenuProps> = ({
  showMenu,
  setShowMenu,
  showMobileMenu,
  toggleMobileMenuVisible,
  isContributionPageActive,
  location,
  isUserLoggedIn,
  menuItems,
  menuLabel,
}) => {
  const handleMouseLeave = () => {
    if (!isContributionPageActive && showMenu) {
      setShowMenu(menuLabel)
    }
  }

  const handleClick = () => {
    setShowMenu(menuLabel)
  }

  if (menuItems.length === 0) {
    return <LocalizedNavLink id={menuLabel} to={URLS.DATASETS} />
  }

  return (
    <div className="contribute-wrapper">
      <div id="contribute-btn-wrapper">
        <Localized id={menuLabel}>
          <TextButton
            className={classNames('contribute-btn', {
              'contribution-page-active': isContributionPageActive,
            })}
            onClick={toggleMobileMenuVisible}
          />
        </Localized>
        {!isContributionPageActive && (
          <ChevronDown
            className={classNames({ 'rotate-180': showMobileMenu })}
            onClick={toggleMobileMenuVisible}
          />
        )}
      </div>
      <button
        className={classNames('contribute-menu', {
          active: showMenu,
          // 'contribution-page-active': isContributionPageActive,
        })}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        data-testid="contribute-menu">
        <div
          className={classNames('contribute-links-wrapper', {
            'show-border': isContributionPageActive,
          })}>
          <p className="nav-link-item">
            <Localized id={menuLabel} />
          </p>
          {menuItems.length > 0 && (
            <ChevronDown className={classNames({ 'rotate-180': showMenu })} />
          )}
        </div>
        {(showMobileMenu || isContributionPageActive) && (
          <div
            className="menu-wrapper-mobile"
            data-testid="contribute-mobile-menu">
            <ContributeMenuContent
              pathname={location.pathname}
              className="mobile-menu-list"
              contributeMenuItems={menuItems}
            />
          </div>
        )}
        {menuItems.length > 0 && (
          <div className="menu-wrapper" data-testid="menu-wrapper">
            <div className="menu">
              <ContributeMenuContent
                className="menu-list"
                contributeMenuItems={menuItems}
                isUserLoggedIn={isUserLoggedIn}
              />
            </div>
          </div>
        )}
      </button>
    </div>
  )
}

export default withRouter(ContributeMenu)
