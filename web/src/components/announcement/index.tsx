import * as React from 'react'
import { useState } from 'react'
import { Localized } from '@fluent/react'

import { LinkButton } from '../ui/ui'
import SpiralIcon from './spiral-icon/spiral-icon'
import URLS from '../../urls'

import { CookieSettings, setCookie, getCookie } from '../../services/cookie'

import './header-announcement.css'
import { CloseIcon, ExternalLinkIcon } from '../ui/icons'
import VisuallyHidden from '../visually-hidden/visually-hidden'

const COOKIE_NAME = 'mcv_user_preferences'
const COOKIE_VALUE = ['disable_announcement'].join('|')

type Props = {
  position?: string
}

export const Announcement = ({ position = 'header' }: Props) => {
  const [isActive, setIsActive] = useState<boolean>(true)
  const cookie = getCookie(COOKIE_NAME)

  const handleClose = () => {
    setIsActive(false)
    setCookie(COOKIE_NAME, COOKIE_VALUE, {
      // days: 5,
      days: 1 / (24 * 60), // 1 minute for tests
      path: '/',
      secure: true,
      sameSite: 'strict',
    })
  }

  if (!isActive || cookie || position !== 'header') {
    return <></>
  }

  return (
    <div className="announcement-wrapper">
      <div className="announcement-container">
        <div className="announcement-container-left">
          <div className="announcement-text">
            {/* TODO: LOCALIZE */}
            <b>New Common Voice datasets</b> are now available to download. Join
            Mozilla Data Collective for access to over 300 high-quality global
            datasets, built by and for the community.
          </div>
          <SpiralIcon />
        </div>
        <div className="announcement-container-right">
          <LinkButton
            absolute
            href={URLS.MDC_ROOT}
            id="join-mdc-button-banner"
            className="join-button"
            rounded
            blank>
            <span className="join-button__content">
              {/* TODO: LOCALIZE */}
              Join Mozilla Data Collective
              <span className="join-button__icon">{<ExternalLinkIcon />}</span>
            </span>
            <VisuallyHidden>
              {/* TODO: LOCALIZE */}
              <span>Opens in a new tab</span>
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
