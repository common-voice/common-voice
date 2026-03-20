import * as React from 'react'
import { useState } from 'react'
import { Localized } from '@fluent/react'

import { LinkButton } from '../ui/ui'
import SpiralIcon from './spiral-icon/spiral-icon'
import URLS from '../../urls'
import { trackGtag } from '../../services/tracker-ga4'
import { setCookie, getCookie } from '../../services/cookie'

import './header-announcement.css'
import { CloseIcon, ExternalLinkIcon } from '../ui/icons'
import VisuallyHidden from '../visually-hidden/visually-hidden'
import { MdcLink, CvDatasheetsLink } from '../shared/links'

// Dismissed announcement IDs are stored as a pipe-separated list.
// Each announcement has its own ID so dismissals are tracked independently.
const DISMISSED_COOKIE_NAME = 'mcv_dismissed_announcements'
const DEFAULT_COOKIE_DURATION = 30 // days

type AnnouncementItem = {
  id: string
  textKey: string
  buttonTextKey: string
  buttonHref: string
  startDate: string
  endDate: string
  showIcon?: boolean
  style?: string
  cookieDays?: number
}

// Non-overlapping list -- the first in-window, non-dismissed entry is shown.
// Add new entries here; do not remove old ones (they are naturally excluded by date).
const ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'mdc-2025',
    textKey: 'announcement-mdc-text',
    buttonTextKey: 'announcement-mdc-button-text',
    buttonHref: URLS.MDC_ROOT,
    startDate: '2025-09-17T00:00:00Z',
    endDate: '2025-12-31T23:59:59Z',
    showIcon: true,
  },
  {
    id: 'release-delay-2026',
    textKey: 'announcement-release-delay',
    buttonTextKey: 'announcement-mdc-button-text',
    buttonHref: URLS.MDC_ROOT,
    startDate: '2026-03-20T00:00:00Z',
    endDate: '2026-03-24T23:59:59Z',
  },
  {
    id: 'release-2026',
    textKey: 'announcement-release',
    buttonTextKey: 'announcement-mdc-button-text',
    buttonHref: URLS.MDC_ROOT,
    startDate: '2026-03-25T00:00:00Z',
    endDate: '2026-04-04T23:59:59Z',
  },
]

const getDismissedIds = (): string[] => {
  const cookie = getCookie(DISMISSED_COOKIE_NAME)
  return cookie ? cookie.split('|') : []
}

const getActiveAnnouncement = (dismissedIds: string[]): AnnouncementItem | null => {
  const now = new Date()
  return (
    ANNOUNCEMENTS.find(
      a =>
        now >= new Date(a.startDate) &&
        now <= new Date(a.endDate) &&
        !dismissedIds.includes(a.id)
    ) ?? null
  )
}

type Props = {
  position?: string
  hide?: boolean
}

export const Announcement = ({ position = 'header', hide = false }: Props) => {
  const [isActive, setIsActive] = useState<boolean>(true)

  const dismissedIds = getDismissedIds()
  const announcement = isActive ? getActiveAnnouncement(dismissedIds) : null

  const handleClose = () => {
    if (!announcement) return
    setCookie(DISMISSED_COOKIE_NAME, [...dismissedIds, announcement.id].join('|'), {
      days: announcement.cookieDays ?? DEFAULT_COOKIE_DURATION,
    })
    setIsActive(false)
    trackGtag('close-announcement-button', { position, announcement_id: announcement.id })
  }

  if (hide || position !== 'header' || !announcement) {
    return <></>
  }

  return (
    <div className={['announcement-wrapper', announcement.style].filter(Boolean).join(' ')}>
      <div className="announcement-container">
        <div className="announcement-container-left">
          <Localized
            id={announcement.textKey}
            elems={{
              strong: <strong />,
              mdcLink: <MdcLink />,
              cvDatasheetsLink: <CvDatasheetsLink />,
            }}>
            <div className="announcement-text" />
          </Localized>
          {announcement.showIcon && <SpiralIcon />}
        </div>
        <div className="announcement-container-right">
          <LinkButton
            href={announcement.buttonHref}
            id="join-announcement-button"
            className="join-button"
            rounded
            blank
            onClick={() =>
              trackGtag('join-announcement-button', { position, announcement_id: announcement.id })
            }>
            <span className="join-button__content">
              <Localized id={announcement.buttonTextKey} />
              <span className="join-button__icon">{<ExternalLinkIcon />}</span>
            </span>
            <VisuallyHidden>
              <Localized id={announcement.buttonTextKey}>
                <span />
              </Localized>
            </VisuallyHidden>
          </LinkButton>
        </div>
      </div>
      <div className="announcement-close-button">
        <CloseIcon black onClick={handleClose} id="close-announcement-button" />
      </div>
    </div>
  )
}
