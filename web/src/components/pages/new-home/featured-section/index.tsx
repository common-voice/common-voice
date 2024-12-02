import React from 'react'

import { Button } from '../../../ui/ui'

import './featured-section.css'
import { Localized } from '@fluent/react'
import { ArrowRight } from '../../../ui/icons'

export const FeaturedSection = () => {
  return (
    <section className="featured-section">
      <div className="featured-section-container">
        <Localized id="featured-section-title">
          <h2 className="featured-title" />
        </Localized>
        <div className="featured-logos">
          <img src={require('./assets/forbes.svg')} alt="" className="logo" />
          <img src={require('./assets/newsweek.svg')} alt="" className="logo" />
          <img src={require('./assets/bbc.svg')} alt="" className="logo" />
          <img
            src={require('./assets/bloomberg.svg')}
            alt=""
            className="logo"
          />
          <img
            src={require('./assets/newscientist.svg')}
            alt=""
            className="logo"
          />
        </div>
        <Localized id="download-press-pack" elems={{ icon: <ArrowRight /> }}>
          <Button rounded />
        </Localized>
      </div>
    </section>
  )
}
