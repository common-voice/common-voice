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
          <img src={require('./assets/collectivat.svg')} alt="" />
          <img src={require('./assets/nvidia.svg')} alt="" />
          <img src={require('./assets/mak.svg')} alt="" />
          <img src={require('./assets/ff.svg')} alt="" />
          <img src={require('./assets/giz.svg')} alt="" />
          <img
            src={require('./assets/Bill_&_Melinda_Gates_Foundation.svg')}
            alt=""
          />
        </div>
      </div>
    </section>
  )
}
