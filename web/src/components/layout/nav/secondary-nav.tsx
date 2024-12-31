import { Localized } from '@fluent/react'
import classNames from 'classnames'
import React from 'react'

import { ContributableLocaleLock, LocaleLink } from '../../locale-helpers'
import {
  EditIcon,
  ListenIcon,
  MenuIcon,
  MicIcon,
  ReviewIcon,
} from '../../ui/icons'
import URLS from '../../../urls'

type SecondaryNavProps = {
  isDemoMode: boolean
  handleSecondaryNavMobileMenuClick: () => void
  isLoggedIn: boolean
}

export const SecondaryNav: React.FC<SecondaryNavProps> = ({
  isDemoMode,
  handleSecondaryNavMobileMenuClick,
  isLoggedIn,
}) => (
  <div className="secondary-nav">
    <MenuIcon onClick={handleSecondaryNavMobileMenuClick} />
    <div className="options">
      <ContributableLocaleLock>
        <LocaleLink
          to={isDemoMode ? URLS.DEMO_SPEAK : URLS.SPEAK}
          className={classNames('secondary-nav-option', {
            'selected-option': location.pathname.includes(URLS.SPEAK),
          })}>
          <div>
            <MicIcon />
            <Localized id="speak" />
          </div>
        </LocaleLink>
        <LocaleLink
          to={isDemoMode ? URLS.DEMO_LISTEN : URLS.LISTEN}
          className={classNames('secondary-nav-option', {
            'selected-option': location.pathname.includes(URLS.LISTEN),
          })}>
          <div>
            <ListenIcon />
            <Localized id="listen" />
          </div>
        </LocaleLink>
      </ContributableLocaleLock>
      <LocaleLink
        to={URLS.WRITE}
        className={classNames('secondary-nav-option', {
          'selected-option': location.pathname.includes(URLS.WRITE),
        })}>
        <div>
          <EditIcon />
          <Localized id="write" />
        </div>
      </LocaleLink>
      {isLoggedIn && (
        <LocaleLink
          to={URLS.REVIEW}
          className={classNames('secondary-nav-option', {
            'selected-option': location.pathname.includes(URLS.REVIEW),
          })}>
          <div>
            <ReviewIcon />
            <Localized id="review" />
          </div>
        </LocaleLink>
      )}
    </div>
  </div>
)
