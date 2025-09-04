import * as React from 'react'
import { useState } from 'react'
import { Localized } from '@fluent/react'

import { LinkButton } from '../ui/ui'
import SpiralIcon from './spiral-icon/spiral-icon'
import URLS from '../../urls'

import './header-announcement.css'
import { CloseIcon, ExternalLinkIcon } from '../ui/icons'
import VisuallyHidden from '../visually-hidden/visually-hidden'

type Props = {
  position?: string
}

export const Announcement = ({ position = 'header' }: Props) => {
  const [isActive, setIsActive] = useState<boolean>(true)

  const handleClose = () => {
    setIsActive(false)
  }

  if (!isActive || position !== 'header') {
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
