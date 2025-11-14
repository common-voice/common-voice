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
            <a
              className="button rounded"
              href={URLs.MDC_DATASETS}
              target="_blank"
              rel="noopener noreferrer">
              <Localized id="explore-datasets" elems={{ icon: <ArrowRight /> }}>
                <span />
              </Localized>
            </a>
          </div>
          <div className="image-container">
            <img src={Table} alt="" width={570} loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  )
}
