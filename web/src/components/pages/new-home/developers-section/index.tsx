import React from 'react'
import { Localized } from '@fluent/react'

import { LinkButton } from '../../../ui/ui'
import { ArrowRight } from '../../../ui/icons'

import Table from './assets/table.png'

import URLs from '../../../../urls'

import './developers-section.css'

export const DevelopersSection = () => {
  return (
    <section className="developers-section">
      <div className="developers-section-container">
        <div className="content">
          <div className="text-container">
            <Localized id="developers-section-title">
              <h1 />
            </Localized>
            <Localized id="developers-section-subtitle">
              <p />
            </Localized>
            <LinkButton rounded to={URLs.DATASETS}>
              <Localized id="explore-datasets" elems={{ icon: <ArrowRight /> }}>
                <span />
              </Localized>
            </LinkButton>
          </div>
          <div className="image-container">
            <img src={Table} alt="" width={570} />
          </div>
        </div>
      </div>
    </section>
  )
}
