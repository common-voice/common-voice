import { Localized } from '@fluent/react'
import classNames from 'classnames'
import React from 'react'

import { ContributableLocaleLock, LocaleNavLink } from '../../locale-helpers'
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
        <div
          className={classNames({
            'selected-option': location.pathname.includes(URLS.SPEAK),
          })}>
          <MicIcon />
          <Localized id="speak">
            <LocaleNavLink to={isDemoMode ? URLS.DEMO_SPEAK : URLS.SPEAK} />
          </Localized>
          {location.pathname.includes(URLS.SPEAK) && (
            <span className="border" />
          )}
          c
        </div>
        <div
          className={classNames({
            'selected-option': location.pathname.includes(URLS.LISTEN),
          })}>
          <ListenIcon />
          <Localized id="listen">
            <LocaleNavLink to={isDemoMode ? URLS.DEMO_LISTEN : URLS.LISTEN} />
          </Localized>
          {location.pathname.includes(URLS.LISTEN) && (
            <span className="border" />
          )}
        </div>
      </ContributableLocaleLock>
      <div
        className={classNames({
          'selected-option': location.pathname.includes(URLS.WRITE),
        })}>
        <EditIcon />
        <Localized id="write">
          <LocaleNavLink to={URLS.WRITE} />
        </Localized>
        {location.pathname.includes(URLS.WRITE) && <span className="border" />}
      </div>
      {isLoggedIn && (
        <div
          className={classNames({
            'selected-option': location.pathname.includes(URLS.REVIEW),
          })}>
          <ReviewIcon />
          <Localized id="review">
            <LocaleNavLink to={URLS.REVIEW} />
          </Localized>
          {location.pathname.includes(URLS.REVIEW) && (
            <span className="border" />
          )}
        </div>
      )}
    </div>
  </div>
)
