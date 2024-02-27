import React from 'react'

import LogoImage from '../ui/logo-image/logo-image'
import DonateButton from '../donate-button/donate-button'

import './donate-banner.css'

export const DonateBanner = () => {
  return (
    <div className="donate-banner-container">
      <div className="donate-cta">
        <h2>
          We need
          <div />
          your help!
        </h2>
      </div>

      <div className="donate-cta-explanation">
        <p>
          It costs almost a million dollars a year to host the datasets and
          improve the platform for the 100+ language communities who rely on
          what we do. If you value open, inclusive data - donate today!
        </p>

        <div className="logo-and-button-container">
          <LogoImage isReverse />
          <DonateButton />
        </div>
      </div>
    </div>
  )
}
