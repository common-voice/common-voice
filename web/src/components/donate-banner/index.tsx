import * as React from 'react'
import { Localized } from '@fluent/react'

import LogoImage from '../ui/logo-image/logo-image'
import DonateButton from '../donate-button/donate-button'

import { useABTestingSplit } from '../../hooks/use-ab-testing-split'

import { SPLIT_A } from '../../constants'

import './donate-banner.css'

type Props = {
  donateCTALocalizedId?: string
  donateCTAExplanationLocalizedId?: string
}

export const DonateBanner = ({
  donateCTALocalizedId = 'donate-banner-cta',
  donateCTAExplanationLocalizedId = 'donate-banner-cta-explanation',
}: Props) => {
  const abTestingSplit = useABTestingSplit()

  const donateBannerBackgroundColour =
    abTestingSplit === SPLIT_A ? 'pink' : 'coral'

  return (
    <div
      className={`donate-banner-container bg-${donateBannerBackgroundColour}`}>
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
