import { Localized } from '@fluent/react'
import classNames from 'classnames'
import * as React from 'react'
import { useState } from 'react'
import { useAccount } from '../../hooks/store-hooks'
import { trackNav } from '../../services/tracker'
import URLS from '../../urls'
import { LocaleLink, useLocale } from '../locale-helpers'
import {
  ChevronDown,
  CogIcon,
  DashboardIcon,
  LogoutIcon,
  UserIcon,
} from '../ui/icons'
import { Avatar, Hr } from '../ui/ui'

import './user-menu.css'

export default function UserMenu() {
  const [locale] = useLocale()
  const account = useAccount()
  const [showMenu, setShowMenu] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  const toggleMenu = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowMenu(!showMenu)
  }

  const closeMenu = () => setShowMenu(false)

  const handleMouseEnter = () => {
    if (!isTouchDevice) {
      setShowMenu(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      setShowMenu(false)
    }
  }

  // Detect touch device
  React.useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    checkTouch()
    window.addEventListener('touchstart', checkTouch, { once: true })
  }, [])

  // Close menu when clicking outside
  React.useEffect(() => {
    if (!showMenu) return

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.user-menu')) {
        closeMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [showMenu])

  return (
    <div data-testid="user-menu">
      <div
        className={'user-menu ' + (showMenu ? 'active' : '')}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
        <button
          className="toggle"
          onClick={toggleMenu}
          onTouchEnd={toggleMenu}
          type="button">
          <div className="username-btn">
            <div>
              <Avatar url={account.avatar_url} />
            </div>
            <span className="name" title={account.username}>
              {account.username}
            </span>
          </div>
          <ChevronDown className={classNames({ 'rotate-180': showMenu })} />
        </button>
        <div className="menu-wrap">
          <div className="menu">
            <span className="triangle" />
            <ul>
              {[
                {
                  route: URLS.DASHBOARD,
                  icon: <DashboardIcon />,
                  id: 'dashboard',
                },
                {
                  route: URLS.PROFILE_INFO,
                  icon: <UserIcon />,
                  id: 'profile',
                },
                {
                  route: URLS.PROFILE_SETTINGS,
                  icon: <CogIcon />,
                  id: 'settings',
                },
              ].map(({ route, icon, id }) => (
                <li key={route}>
                  <LocaleLink to={route} onClick={() => trackNav(id, locale)}>
                    {icon}
                    <Localized id={id}>
                      <span />
                    </Localized>
                  </LocaleLink>
                  <Hr />
                </li>
              ))}
              <li>
                <a href="/logout">
                  <LogoutIcon />
                  <Localized id="logout">
                    <span />
                  </Localized>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
