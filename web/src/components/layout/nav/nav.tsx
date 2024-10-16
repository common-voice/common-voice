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
  const [showMobileMenu, setShowMobileMenu] = React.useState(false)
  const [activeNavItem, setActiveNavItem] = React.useState<NavItem | null>(null)

  const account = useAccount()

  const toggleMobileMenuVisible = React.useCallback(() => {
    setShowMobileMenu(prev => !prev)
  }, [])

  const handleNavItemClick = React.useCallback((navItem: NavItem) => {
    setActiveNavItem(prev => (prev === navItem ? null : navItem))
  }, [])

  const renderMenu = (key: NavItem) => {
    const menu = (
      <ContributeMenu
        key={key}
        showMenu={activeNavItem === key}
        setShowMenu={handleNavItemClick}
        showMobileMenu={showMobileMenu}
        toggleMobileMenuVisible={toggleMobileMenuVisible}
        isContributionPageActive={isContributionPageActive}
        isUserLoggedIn={Boolean(account)}
        menuItems={menuItems[key].items}
        menuLabel={key}
      />
    )

    return menuItems[key].renderContributableLocaleLock ? (
      <ContributableLocaleLock key={key}>{menu}</ContributableLocaleLock>
    ) : (
      menu
    )
  }

  return (
    <nav {...props} className="nav-list" aria-label="Main Navigation">
      <div className="nav-links">
        <ContributableLocaleLock>{renderMenu('speak')}</ContributableLocaleLock>
        <div className={shouldExpandNavItems ? 'fade-in' : 'fade-out'}>
          {typedObjectKeys(menuItems).map(key => {
            if (key === 'speak') return null
            return renderMenu(key)
          })}
        </div>
      </div>
      {children}
    </nav>
  )
}

export default Nav
