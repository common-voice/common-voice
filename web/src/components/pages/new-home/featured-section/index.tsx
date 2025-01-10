import React from 'react'
import { Localized } from '@fluent/react'

import './featured-section.css'

export const FeaturedSection = () => {
  return (
    <section className="featured-section">
      <div className="featured-section-container">
        <Localized id="featured-section-title">
          <h2 className="featured-title" />
        </Localized>
        <div className="featured-logos">
          <img src={require('./assets/bbc.svg')} alt="" className="logo" />
          <img
            src={require('./assets/venture-beat.svg')}
            alt=""
            className="logo"
            width={220}
            height={30}
          />
          <img
            src={require('./assets/MIT-technology-review.svg')}
            alt=""
            className="logo"
          />
          <img
            src={require('./assets/fast-company.svg')}
            alt=""
            className="logo"
          />
          <img
            src={require('./assets/financial-times.svg')}
            alt=""
            className="logo"
          />
        </div>
      </div>
    </section>
  )
}
