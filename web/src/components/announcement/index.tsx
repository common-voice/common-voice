import * as React from 'react'
import { useState } from 'react'
import { Localized } from '@fluent/react'

import SpiralIcon from './spiral-icon/spiral-icon'
import { LinkButton } from '../ui/ui'

import './header-announcement.css'
import { CloseIcon, ExternalLinkIcon } from '../ui/icons'

const DEST_URL = 'https://datacollective.mozillafoundation.org/'

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
            <b>New Common Voice datasets</b> are now available to download. Join
            Mozilla Data Collective for access to over 300 high-quality global
            datasets, built by and for the community.
            {/* <Localized
          id={`announcement-text`}
          elems={{ mark: <mark />, br: <div /> }}></Localized> */}
          </div>
          <SpiralIcon />
        </div>
        <div className="announcement-container-right">
          <LinkButton
            id="join-mdc-button-banner"
            className="join-button"
            rounded
            blank
            to={DEST_URL}>
            <span className="join-button__content">
              Join Mozilla Data Collective
              <span className="join-button__icon">{<ExternalLinkIcon />}</span>
            </span>
          </LinkButton>
        </div>
      </div>
      <div className="announcement-close-button">
        <CloseIcon black onClick={handleClose} />
      </div>
    </div>
  )
}
