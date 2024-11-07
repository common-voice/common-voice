import * as React from 'react'
import classNames from 'classnames'
import { Localized, useLocalization } from '@fluent/react'
import { RouteComponentProps, withRouter } from 'react-router'
import { Tooltip } from 'react-tooltip'

import { TextButton } from '../../../ui/ui'
import { BoldChevron, ChevronDown } from '../../../ui/icons'
import ContributeMenuContent from '../contribute-menu-content'

import { LocalizedNavLink, NavItem } from '../nav'
import URLS from '../../../../urls'

import './contribute-menu.css'

export type ContributeMenuItem = {
  localizedId: string
  internalHref?: string
  externalHref?: string
  icon: React.ComponentType
  requiresAuth?: boolean
  menuItemTooltip: string
  menuItemAriaLabel: string
}

export type MenuConfig = {
  items?: ContributeMenuItem[]
  menuTooltip: string
  menuAriaLabel: string
  renderContributableLocaleLock?: boolean
}

interface ContributeMenuProps extends RouteComponentProps {
  showMenu: boolean
  setShowMenu: (navItem: NavItem) => void
  showMobileMenu: boolean
  isUserLoggedIn: boolean
  menuItems: ContributeMenuItem[]
  menuLabel: NavItem
  menuTooltip: string
  menuAriaLabel: string
}

const ContributeMenu: React.FC<ContributeMenuProps> = ({
  showMenu,
  setShowMenu,
  showMobileMenu,
  location,
  isUserLoggedIn,
  menuItems,
  menuLabel,
  menuTooltip,
  menuAriaLabel,
}) => {
  const { l10n } = useLocalization()

  const hasMenuItems = menuItems && menuItems.length > 0

  const handleClick = () => {
    setShowMenu(menuLabel)
  }

  if (!menuItems) {
    return (
      <div className="contribute-wrapper datasets">
        <LocalizedNavLink id={menuLabel} to={URLS.DATASETS} />
        <Tooltip
          anchorSelect={`#${menuLabel}`}
          style={{
            width: 'auto',
            maxWidth: '550px',
            fontFamily: 'Open Sans',
            fontSize: '12px',
          }}>
          {l10n.getString(menuTooltip)}
        </Tooltip>
      </div>
    )
  }

  const visibleMenuItems = isUserLoggedIn
    ? menuItems
    : menuItems.filter(
        item => (item.requiresAuth && isUserLoggedIn) || !item.requiresAuth
      )

  return (
    <div className="contribute-wrapper">
      <div id="contribute-btn-wrapper">
        <Localized id={menuLabel}>
          <TextButton
            className="contribute-btn"
            onClick={handleClick}
            aria-expanded={showMobileMenu}
            aria-controls="contribute-menu"
            id={`${menuLabel}-mobile`}
          />
        </Localized>
        {hasMenuItems && (
          <BoldChevron
            className={classNames({ 'rotate-180': showMobileMenu })}
            onClick={handleClick}
          />
        )}
      </div>
      <button
        className={classNames('contribute-menu', {
          active: showMenu,
        })}
        onClick={handleClick}
        data-testid="contribute-menu"
        aria-expanded={showMenu}
        aria-controls="contribute-menu"
        aria-label={l10n.getString(menuAriaLabel)}
        id={menuLabel}>
        <div className="contribute-links-wrapper">
          <p className="nav-link-item">
            <Localized id={menuLabel} />
          </p>
          {hasMenuItems && (
            <ChevronDown className={classNames({ 'rotate-180': showMenu })} />
          )}
        </div>
        {showMobileMenu && hasMenuItems && (
          <div
            className="menu-wrapper-mobile"
            data-testid="contribute-mobile-menu"
            style={{ height: `${40 * visibleMenuItems.length}px` }}>
            <ContributeMenuContent
              pathname={location.pathname}
              className="mobile-menu-list"
              contributeMenuItems={menuItems}
              isUserLoggedIn={isUserLoggedIn}
            />
          </div>
        )}
        {hasMenuItems && (
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
      <Tooltip
        anchorSelect={`#${menuLabel}`}
        place="bottom"
        style={{
          width: 'auto',
          maxWidth: '550px',
          marginBlockStart: '-30px',
          fontFamily: 'Open Sans',
          fontSize: '12px',
        }}
        hidden={showMenu}>
        {l10n.getString(menuTooltip)}
      </Tooltip>
    </div>
  )
}

export default withRouter(ContributeMenu)
