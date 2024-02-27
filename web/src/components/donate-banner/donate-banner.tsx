import * as React from 'react'
import classNames from 'classnames'
import { Localized } from '@fluent/react'

import LogoImage from '../ui/logo-image/logo-image'
import DonateButton from '../donate-button/donate-button'

import './donate-banner.css'

type Props = {
  background: 'pink' | 'coral'
}

export const DonateBanner = ({ background }: Props) => {
  return (
    <div
      className={classNames('donate-banner-container', {
        [`bg-${background}`]: background,
      })}>
      <div className="donate-cta">
        <Localized
          id="donate-banner-cta"
          elems={{ mark: <mark />, br: <div /> }}>
          <h2 />
        </Localized>
      </div>

      <div className="donate-cta-explanation">
        <Localized
          elems={{ strong: <strong /> }}
          id="donate-banner-cta-explanation">
          <p />
        </Localized>

        <div className="logo-and-button-container">
          <LogoImage isReverse />
          <DonateButton />
        </div>
      </div>
    </div>
  )
}
