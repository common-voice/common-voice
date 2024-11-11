import React from 'react'
import { Localized } from '@fluent/react'

import { LinkButton } from '../../../ui/ui'
import { ChevronRight } from '../../../ui/icons'

import URLs from '../../../../urls'

import './action-items-section.css'

export const ActionItemsSection = () => {
  return (
    <section className="community-section">
      <div className="community-section-container">
        <Localized id="community-section-title">
          <h1 className="title" />
        </Localized>

        <Localized id="community-section-subtitle">
          <p className="subtitle" />
        </Localized>

        <div className="card-container">
          <div className="card">
            <div className="card-image scripted" />
            <div className="card-body">
              <Localized id="scripted-card-header">
                <h2 className="card-header" />
              </Localized>
              <Localized id="scripted-card-content">
                <p />
              </Localized>
              <LinkButton rounded to={URLs.SPEAK}>
                <Localized id="speak">
                  <span />
                </Localized>
                <ChevronRight />
              </LinkButton>
            </div>
          </div>

          <div className="card">
            <div className="card-image spontaneous" />
            <div className="card-body">
              <Localized id="spontaneous-card-header">
                <h2 className="card-header" />
              </Localized>
              <Localized id="spontaneous-card-content">
                <p />
              </Localized>
              <LinkButton rounded className="disabled">
                <Localized id="coming-soon">
                  <span />
                </Localized>
                <ChevronRight />
              </LinkButton>
            </div>
          </div>

          <div className="card">
            <div className="card-image language-text" />
            <div className="card-body">
              <Localized id="language-text-card-header">
                <h2 className="card-header" />
              </Localized>
              <Localized id="language-text-card-content">
                <p />
              </Localized>
              <LinkButton rounded to={URLs.WRITE}>
                <Localized id="add-text">
                  <span />
                </Localized>
                <ChevronRight />
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
