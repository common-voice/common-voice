import React from 'react'
import { Localized } from '@fluent/react'

import { ArrowRight } from '../../../ui/icons'
import { ContactLink } from '../../../shared/links'

import './partner-section.css'

export const PartnerSection = () => {
  return (
    <section className="partner-section">
      <div className="partner-section-container">
        <div className="content">
          <Localized id="partner-section-title">
            <h2 className="title" />
          </Localized>
          <Localized
            id="partner-section-subtitle-tech-companies"
            elems={{ bold: <b /> }}>
            <p />
          </Localized>
          <Localized
            id="partner-section-subtitle-civil-society"
            elems={{ bold: <b /> }}>
            <p />
          </Localized>
          <Localized
            id="partner-section-subtitle-philantropy"
            elems={{ bold: <b /> }}>
            <p />
          </Localized>
          <ContactLink>
            <Localized
              id="get-in-touch-button"
              elems={{ icon: <ArrowRight /> }}>
              <span />
            </Localized>
          </ContactLink>
        </div>
      </div>
    </section>
  )
}
