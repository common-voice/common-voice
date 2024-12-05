import React from 'react'
import { Localized } from '@fluent/react'

import { Button } from '../../../ui/ui'
import { ArrowRight } from '../../../ui/icons'

import Table from './assets/table.png'

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
            <Localized id="explore-datasets" elems={{ icon: <ArrowRight /> }}>
              <Button rounded />
            </Localized>
          </div>
          <div className="image-container">
            <img src={Table} alt="" width={570} />
          </div>
        </div>
      </div>
    </section>
  )
}
