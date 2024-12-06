import React from 'react'
import { Localized, useLocalization } from '@fluent/react'
import { Link } from 'react-router-dom'
import { Tooltip } from 'react-tooltip'

import { ArrowRight } from '../../../ui/icons'

import { useLocale } from '../../../locale-helpers'

import URLs from '../../../../urls'

import './get-involved.css'

export const GetInvolvedSection = () => {
  const { l10n } = useLocalization()
  const [_, toLocaleRoute] = useLocale()

  return (
    <section className="get-involved-section" id="get-involved">
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
                  <span />
                </Localized>
                <div className="arrow-container">
                  <ArrowRight />
                </div>
              </Link>
            </li>
            <li>
              <Link to={toLocaleRoute(URLs.LISTEN)}>
                <Localized id="validate-readings-link">
                  <span />
                </Localized>
                <div className="arrow-container">
                  <ArrowRight />
                </div>
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
              <p id="answer-questions-link">
                {l10n.getString('answer-questions-link')}
              </p>
              <div className="arrow-container disabled">
                <ArrowRight />
              </div>
              <Tooltip anchorSelect="#answer-questions-link" place="bottom">
                {l10n.getString('coming-soon')}
              </Tooltip>
            </li>
            <li>
              <p id="transcribe-answers-link">
                {l10n.getString('transcribe-answers-link')}
              </p>
              <div className="arrow-container disabled">
                <ArrowRight />
              </div>
              <Tooltip anchorSelect="#transcribe-answers-link" place="bottom">
                {l10n.getString('coming-soon')}
              </Tooltip>
            </li>
            <li>
              <p id="review-transcriptions-link">
                {l10n.getString('review-transcriptions-link')}
              </p>
              <div className="arrow-container disabled">
                <ArrowRight />
              </div>
              <Tooltip
                anchorSelect="#review-transcriptions-link"
                place="bottom">
                {l10n.getString('coming-soon')}
              </Tooltip>
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
              <p id="review-transcript">
                {l10n.getString('review-transcriptions-link')}
              </p>
              <div className="arrow-container disabled">
                <ArrowRight />
              </div>
              <Tooltip anchorSelect="#review-transcript" place="bottom">
                {l10n.getString('coming-soon')}
              </Tooltip>
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
