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
import { useOutsideClick } from '../../../hooks/use-outside-click'
import { typedObjectKeys } from '../../../utility'

import './nav.css'

type NavProps = {
  id?: string
  shouldExpandNavItems?: boolean
  isContributionPageActive?: boolean
  children?: React.ReactNode
}

export type NavItem = 'speak' | 'listen' | 'write' | 'about' | 'download'

export const LocalizedNavLink = ({ id, to }: { id: string; to: string }) => {
  const [locale] = useLocale()
  return (
    <Localized id={id}>
      <LocaleNavLink
        className={getTrackClass('fs', id)}
        to={to}
        exact
        onClick={() => trackNav(id, locale)}
        id={id}
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

  const handleClickOutside = () => {
    setActiveNavItem(null)
  }

  const ref = useOutsideClick(handleClickOutside)

  const renderMenu = (menuItem: NavItem) => {
    const menu = (
      <ContributeMenu
        key={menuItem}
        showMenu={activeNavItem === menuItem}
        setShowMenu={handleNavItemClick}
        showMobileMenu={activeNavItem === menuItem}
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
    <nav {...props} className="nav-list" aria-label="Main Navigation" ref={ref}>
      <div className="nav-links">
        <div className={shouldExpandNavItems ? 'fade-in' : 'fade-out'}>
          {typedObjectKeys(menuItems).map(key => {
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
