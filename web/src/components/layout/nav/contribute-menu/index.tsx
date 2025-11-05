import * as React from 'react'
import classNames from 'classnames'
import { Localized, useLocalization } from '@fluent/react'
import { RouteComponentProps, withRouter } from 'react-router'
import { Tooltip } from 'react-tooltip'

import { TextButton } from '../../../ui/ui'
import { BoldChevron, ChevronDown, ExternalLinkIcon } from '../../../ui/icons'
import ContributeMenuContent from '../contribute-menu-content'

import { LocalizedNavLink, NavItem } from '../nav'
import URLS from '../../../../urls'
import { isContributable, useLocale } from '../../../locale-helpers'
import { trackGtag } from '../../../../services/tracker-ga4'

import './contribute-menu.css'

export type ContributeMenuItem = {
  localizedId: string
  internalHref?: string
  externalHref?: string
  icon: React.ComponentType
  requiresAuth?: boolean
  menuItemTooltip: string
  menuItemAriaLabel: string
  type: 'scripted' | 'spontaneous' | 'general'
}

export type MenuConfig = {
  items?: ContributeMenuItem[]
  menuTooltip: string
  menuAriaLabel: string
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
  toggleMenu?: () => void
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
  toggleMenu,
}) => {
  const { l10n } = useLocalization()

  const [locale] = useLocale()

  const isLocaleContributable = isContributable(locale)

  const hasMenuItems = menuItems && menuItems.length > 0

  const handleClick = () => {
    setShowMenu(menuLabel)
    trackGtag(`${menuLabel}-menu-label-click`)
  }

  if (!menuItems) {
    return (
      <div className="contribute-wrapper datasets">
        <a href={URLS.MDC_DATASETS} target="_blank" rel="noopener noreferrer">
          {l10n.getString(menuLabel)}
          <ExternalLinkIcon />
        </a>
        <Tooltip
          anchorSelect={`#${menuLabel}`}
          style={{
            width: 'auto',
            maxWidth: '550px',
            fontFamily: 'Open Sans',
            fontSize: '12px',
            zIndex: '1',
          }}
          openEvents={{ mouseover: true }}>
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
            style={{ height: `${48 * visibleMenuItems.length}px` }}>
            <ContributeMenuContent
              pathname={location.pathname}
              className="mobile-menu-list"
              contributeMenuItems={menuItems}
              isUserLoggedIn={isUserLoggedIn}
              isLocaleContributable={isLocaleContributable}
              toggleMenu={toggleMenu}
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
                isLocaleContributable={isLocaleContributable}
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
          zIndex: '1',
        }}
        hidden={showMenu}
        openEvents={{ mouseover: true }}>
        {l10n.getString(menuTooltip)}
      </Tooltip>
    </div>
  )
}

export default withRouter(ContributeMenu)
