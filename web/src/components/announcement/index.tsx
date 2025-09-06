import * as React from 'react'
import { useState } from 'react'
import { Localized } from '@fluent/react'

import { LinkButton } from '../ui/ui'
import SpiralIcon from './spiral-icon/spiral-icon'
import URLS from '../../urls'

import { setCookie, getCookie } from '../../services/cookie'
// TODO: Currently we only check cookie existence
// In the next iteration we will use multi-value user-preference cookies
// Then we will need to get/parse the values inside
// import { CookieSettings } from '../../services/cookie'

import './header-announcement.css'
import { CloseIcon, ExternalLinkIcon } from '../ui/icons'
import VisuallyHidden from '../visually-hidden/visually-hidden'

const COOKIE_NAME = 'mcv_user_preferences'
const COOKIE_VALUE = ['disable_announcement'].join('|')
const COOKIE_DURATION = 5 // days

const ANNOUNCEMENT_ON_DATE = '2025-09-17T00:00:00Z'
const ANNOUNCEMENT_OFF_DATE = '2025-12-31T23:59:59Z'

type Props = {
  position?: string
  hide?: boolean
}

export const Announcement = ({ position = 'header', hide = false }: Props) => {
  const [isActive, setIsActive] = useState<boolean>(true)
  const cookie = getCookie(COOKIE_NAME)

  const handleClose = () => {
    setIsActive(false)
    setCookie(COOKIE_NAME, COOKIE_VALUE, {
      days: COOKIE_DURATION,
    })
  }

  const now = new Date()
  const isInPublishPeriod =
    now >= new Date(ANNOUNCEMENT_ON_DATE) &&
    now <= new Date(ANNOUNCEMENT_OFF_DATE)

  if (
    hide ||
    !isInPublishPeriod ||
    !isActive ||
    cookie ||
    position !== 'header'
  ) {
    return <></>
  }

  return (
    <div className="announcement-wrapper">
      <div className="announcement-container">
        <div className="announcement-container-left">
          <Localized id="announcement-mdc-text" elems={{ strong: <strong /> }}>
            <div className="announcement-text" />
          </Localized>
          <SpiralIcon />
        </div>
        <div className="announcement-container-right">
          <LinkButton
            href={URLS.MDC_ROOT}
            id="join-mdc-button-banner"
            className="join-button"
            rounded
            blank>
            <span className="join-button__content">
              <Localized id="announcement-mdc-button-text" />
              <span className="join-button__icon">{<ExternalLinkIcon />}</span>
            </span>
            <VisuallyHidden>
              <Localized id="announcement-mdc-button-text">
                <span />
              </Localized>
            </VisuallyHidden>
          </LinkButton>
        </div>
      </div>
      <div className="announcement-close-button">
        <CloseIcon black onClick={handleClose} />
      </div>
    </div>
  )
}
