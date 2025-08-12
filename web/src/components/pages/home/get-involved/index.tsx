import React from 'react'
import { Localized, useLocalization } from '@fluent/react'
import { Link } from 'react-router-dom'
import { Tooltip } from 'react-tooltip'
import classNames from 'classnames'

import { ArrowRight } from '../../../ui/icons'

import { useLocale } from '../../../locale-helpers'

import URLs from '../../../../urls'

import './get-involved.css'

type Props = {
  isLocaleContributable: boolean
}

export const GetInvolvedSection: React.FC<Props> = ({
  isLocaleContributable,
}) => {
  const { l10n } = useLocalization()
  const [_, toLocaleRoute] = useLocale()

  return (
    <section className="get-involved-section">
      <Localized id="get-involved-section-title">
        <h2 />
      </Localized>
      <div className="cards-container">
        <div className="card">
          <Localized id="scripted-card-header">
            <h3 />
          </Localized>
          <div className="card-image scripted" />
          <ul>
            <li>
              <Link to={toLocaleRoute(URLs.SPEAK)}>
                <Localized id="read-sentences-link">
                  <span id="read-sentences-link" />
                </Localized>
                <div
                  className={classNames('arrow-container', {
                    disabled: !isLocaleContributable,
                  })}>
                  <ArrowRight />
                </div>
                <Tooltip
                  anchorSelect="#read-sentences-link"
                  place="bottom"
                  hidden={isLocaleContributable}
                  style={{ fontFamily: 'Open Sans', fontSize: '14.4px' }}>
                  {l10n.getString('coming-soon')}
                </Tooltip>
              </Link>
            </li>
            <li>
              <Link to={toLocaleRoute(URLs.LISTEN)}>
                <Localized id="validate-readings-link">
                  <span id="validate-readings-link" />
                </Localized>
                <div
                  className={classNames('arrow-container', {
                    disabled: !isLocaleContributable,
                  })}>
                  <ArrowRight />
                </div>
                <Tooltip
                  anchorSelect="#validate-readings-link"
                  place="bottom"
                  hidden={isLocaleContributable}
                  style={{ fontFamily: 'Open Sans', fontSize: '14.4px' }}>
                  {l10n.getString('coming-soon')}
                </Tooltip>
              </Link>
            </li>
            <li>
              <Link to={toLocaleRoute(URLs.WRITE)}>
                <Localized id="contribute-link">
                  <span />
                </Localized>
                <div className="arrow-container">
                  <ArrowRight />
                </div>
              </Link>
            </li>
          </ul>
        </div>
        <div className="card">
          <Localized id="spontaneous-card-header">
            <h3 />
          </Localized>
          <div className="card-image spontaneous" />
          <ul>
            <li>
              <a href={URLs.QUESTION} target="_blank" rel="noreferrer">
                <Localized id="answer-questions-link">
                  <span id="answer-questions-link" />
                </Localized>
              </a>
              <div className="arrow-container">
                <ArrowRight />
              </div>
            </li>
            <li>
              <a href={URLs.TRANSCRIBE} target="_blank" rel="noreferrer">
                <Localized id="transcribe-answers-link">
                  <span id="transcribe-answers-link" />
                </Localized>
              </a>
              <div className="arrow-container">
                <ArrowRight />
              </div>
            </li>
            <li>
              <a href={URLs.CHECK_TRANSCRIPT} target="_blank" rel="noreferrer">
                <Localized id="review-transcriptions-link">
                  <span id="review-transcriptions-link" />
                </Localized>
              </a>
              <div className="arrow-container">
                <ArrowRight />
              </div>
            </li>
          </ul>
        </div>
        <div className="card">
          <Localized id="language-text-card-header">
            <h3 />
          </Localized>
          <div className="card-image language-text" />
          <ul>
            <li>
              <Link to={toLocaleRoute(URLs.WRITE)}>
                <Localized id="contribute-text-link">
                  <span />
                </Localized>
                <div className="arrow-container">
                  <ArrowRight />
                </div>
              </Link>
            </li>
            <li>
              <a href={URLs.CHECK_TRANSCRIPT} target="_blank" rel="noreferrer">
                <Localized id="review-transcriptions-link">
                  <span id="review-transcriptions-link" />
                </Localized>
              </a>
              <div className="arrow-container">
                <ArrowRight />
              </div>
            </li>
            <li>
              <a
                href="https://foundation.mozilla.org/blog/topic/common-voice/"
                target="_blank"
                rel="noreferrer">
                {l10n.getString('press-and-stories-link')}
                <div className="arrow-container">
                  <ArrowRight />
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
