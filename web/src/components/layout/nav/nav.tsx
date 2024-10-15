import { Localized } from '@fluent/react'
import * as React from 'react'

import { trackNav, getTrackClass } from '../../../services/tracker'
import {
  ChatBubbleIcon,
  CheckCircle,
  EditIcon,
  FilePlus,
  GlobeIcon,
  MicIcon,
  PlayIcon,
  ReviewIcon,
  ShareIcon,
  TranscribeIcon,
  TrendingUp,
} from '../../ui/icons'
import URLS from '../../../urls'
import { LocaleNavLink, useLocale } from '../../locale-helpers'
import ContributeMenu, { ContributeMenuItem } from './contribute-menu'
import { useAccount } from '../../../hooks/store-hooks'

import './nav.css'

type NavProps = {
  id?: string
  shouldExpandNavItems?: boolean
  isContributionPageActive?: boolean
  children?: React.ReactNode
}

const LocalizedNavLink = ({ id, to }: { id: string; to: string }) => {
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

const speakMenuItems = [
  { icon: MicIcon, href: URLS.SPEAK, localizedId: 'read-sentences' },
  { icon: ChatBubbleIcon, localizedId: 'answer-questions' },
]

const menuItems: Record<string, ContributeMenuItem[]> = {
  speak: [
    { icon: MicIcon, href: URLS.SPEAK, localizedId: 'read-sentences' },
    { icon: ChatBubbleIcon, localizedId: 'answer-questions' },
  ],
  listen: [
    { icon: PlayIcon, href: URLS.SPEAK, localizedId: 'validate-readings' },
    { icon: CheckCircle, localizedId: 'review-transcriptions' },
  ],
  write: [
    { icon: EditIcon, href: URLS.WRITE, localizedId: 'add-sentences' },
    { icon: ReviewIcon, href: URLS.REVIEW, localizedId: 'review-sentences' },
    { icon: FilePlus, localizedId: 'add-questions' },
    { icon: TranscribeIcon, localizedId: 'transcribe-audio' },
  ],
  download: [],
  about: [
    { icon: TrendingUp, localizedId: 'partners' },
    { icon: ShareIcon, localizedId: 'press-and-stories' },
    {
      icon: GlobeIcon,
      href: URLS.LANGUAGES,
      localizedId: 'community-and-languages',
    },
  ],
}

const Nav: React.FC<NavProps> = ({
  children,
  shouldExpandNavItems,
  isContributionPageActive,
  ...props
}) => {
  const [showMenu, setShowMenu] = React.useState(false)
  const [showMobileMenu, setShowMobileMenu] = React.useState(false)

  const account = useAccount()

  const toggleMobileMenuVisible = () => {
    setShowMobileMenu(!showMobileMenu)
  }

  return (
    <nav {...props} className="nav-list">
      <div className="nav-links">
        {/* <ContributeMenu
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          showMobileMenu={showMobileMenu}
          toggleMobileMenuVisible={toggleMobileMenuVisible}
          isContributionPageActive={isContributionPageActive}
          isUserLoggedIn={Boolean(account)}
          menuItems={speakMenuItems}
          renderContributableLock
        />
        <span className="divider" />
        <div className={shouldExpandNavItems ? 'fade-in' : 'fade-out'}>
          <>
            <ContributeMenu
              showMenu={showMenu}
              setShowMenu={setShowMenu}
              showMobileMenu={showMobileMenu}
              toggleMobileMenuVisible={toggleMobileMenuVisible}
              isContributionPageActive={isContributionPageActive}
              isUserLoggedIn={Boolean(account)}
              menuItems={speakMenuItems}
              renderContributableLock
            />
            <LocalizedNavLink id="datasets" to={URLS.DATASETS} />
            <LocalizedNavLink id="partner" to={URLS.PARTNER} />
            <LocalizedNavLink id="about" to={URLS.ABOUT} />
          </>
        </div> */}
        {Object.keys(menuItems).map(key => (
          <ContributeMenu
            showMenu={showMenu}
            setShowMenu={setShowMenu}
            showMobileMenu={showMobileMenu}
            toggleMobileMenuVisible={toggleMobileMenuVisible}
            isContributionPageActive={isContributionPageActive}
            isUserLoggedIn={Boolean(account)}
            menuItems={menuItems[key]}
            renderContributableLock
            menuLabel={key}
            key={key}
          />
        ))}
      </div>
      {children}
    </nav>
  )
}

export default Nav
