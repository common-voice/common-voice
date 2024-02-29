import * as React from 'react'
import classNames from 'classnames'
import { Localized } from '@fluent/react'

import LogoImage from '../ui/logo-image/logo-image'
import DonateButton from '../donate-button/donate-button'

import { DonateBannerColour } from '../../stores/donate-banner'

import './donate-banner.css'

type Props = {
  background: DonateBannerColour
  donateCTALocalizedId?: string
  donateCTAExplanationLocalizedId?: string
}

export const DonateBanner = ({
  background,
  donateCTALocalizedId = 'donate-banner-cta',
  donateCTAExplanationLocalizedId = 'donate-banner-cta-explanation',
}: Props) => {
  return (
    <div
      className={classNames('donate-banner-container', {
        [`bg-${background}`]: background,
      })}>
      <div className="donate-cta">
        <Localized
          id={donateCTALocalizedId}
          elems={{ mark: <mark />, br: <div /> }}>
          <h2 />
        </Localized>
      </div>

      <div className="donate-cta-explanation">
        <Localized
          elems={{ strong: <strong /> }}
          id={donateCTAExplanationLocalizedId}>
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
