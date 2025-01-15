import React from 'react'
import { Localized } from '@fluent/react'

import './partners.css'

export const PartnersSection = () => {
  return (
    <section className="partners-section">
      <div className="partners-section-container">
        <Localized id="our-partners-include">
          <h2 className="partners-title" />
        </Localized>
        <div className="partners-logos">
          <img
            src={require('./assets/collectivat-small.jpg')}
            alt=""
            className="logo collectivat"
          />
          <img src={require('./assets/nvidia-logo.svg')} alt="" />
          <img
            src={require('./assets/mak-logo-small.jpg')}
            alt=""
            className="logo mak"
          />
          <img
            src={require('./assets/ff-logo.svg')}
            alt=""
            className="logo ff"
          />
          <img src={require('./assets/giz-logo.jpg')} alt="" className="logo" />
          <img
            src={require('./assets/Bill_&_Melinda_Gates_Foundation_logo.jpg')}
            alt=""
            className="logo"
          />
        </div>
      </div>
    </section>
  )
}
