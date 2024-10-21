import { Localized } from '@fluent/react'
import * as React from 'react'

import { trackNav, getTrackClass } from '../../../services/tracker'

import {
  ContributableLocaleLock,
  LocaleNavLink,
  useLocale,
} from '../../locale-helpers'
import { menuItems } from './menu-items'
import ContributeMenu from './contribute-menu'
import { useAccount } from '../../../hooks/store-hooks'
import { typedObjectKeys } from '../../../utility'

import './nav.css'

type NavProps = {
  id?: string
  shouldExpandNavItems?: boolean
  isContributionPageActive?: boolean
  children?: React.ReactNode
}

export type NavItem = 'speak' | 'listen' | 'write' | 'about' | 'download'
const SPEAK_MENU_ITEM = 'speak'

export const LocalizedNavLink = ({ id, to }: { id: string; to: string }) => {
  const [locale] = useLocale()
  return (
    <Localized id={id}>
      <LocaleNavLink
        className={getTrackClass('fs', id)}
        to={to}
        exact
        onClick={() => trackNav(id, locale)}
      />
    </Localized>
  )
}

const Nav: React.FC<NavProps> = ({
  children,
  shouldExpandNavItems,
  isContributionPageActive,
  ...props
}) => {
  const [activeNavItem, setActiveNavItem] = React.useState<NavItem | null>(null)

  const account = useAccount()

  const handleNavItemClick = React.useCallback((navItem: NavItem) => {
    setActiveNavItem(prev => (prev === navItem ? null : navItem))
  }, [])

  const renderMenu = (menuItem: NavItem) => {
    const menu = (
      <ContributeMenu
        key={menuItem}
        showMenu={activeNavItem === menuItem}
        setShowMenu={handleNavItemClick}
        showMobileMenu={activeNavItem === menuItem}
        isContributionPageActive={isContributionPageActive}
        isUserLoggedIn={Boolean(account)}
        menuItems={menuItems[menuItem].items}
        menuLabel={menuItem}
        menuTooltip={menuItems[menuItem].menuTooltip}
        menuAriaLabel={menuItems[menuItem].menuAriaLabel}
      />
    )

    return menuItems[menuItem].renderContributableLocaleLock ? (
      <ContributableLocaleLock key={menuItem}>{menu}</ContributableLocaleLock>
    ) : (
      menu
    )
  }

  return (
    <nav {...props} className="nav-list" aria-label="Main Navigation">
      <div className="nav-links">
        <ContributableLocaleLock>
          {renderMenu(SPEAK_MENU_ITEM)}
        </ContributableLocaleLock>
        <div className="divider" />
        <div className={shouldExpandNavItems ? 'fade-in' : 'fade-out'}>
          {typedObjectKeys(menuItems).map(key => {
            if (key === SPEAK_MENU_ITEM) return null
            return (
              <React.Fragment key={key}>
                {renderMenu(key)}
                <div className="divider" />
              </React.Fragment>
            )
          })}
        </div>
      </div>
      {children}
    </nav>
  )
}

export default Nav
