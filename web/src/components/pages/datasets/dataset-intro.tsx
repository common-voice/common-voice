import * as React from 'react'
import { Localized } from '@fluent/react'

import PageHeading from '../../ui/page-heading'

import './dataset-intro.css'

const ANNOUNCEMENT_ON_DATE = '2025-09-10T00:00:00Z'
const now = new Date()
const isMdcPublished = now >= new Date(ANNOUNCEMENT_ON_DATE)

const DatasetIntro = () => {
  return (
    <div className="dataset-intro">
      <div className="content-wrapper">
        <div className="heading-and-intro-container">
          <div>
            <PageHeading isLight>
              <Localized id="datasets-heading" />
              <p className="intro-summary">
                <Localized id={isMdcPublished ? "datasets-headline-mdc" : "datasets-headline"} />
              </p>
            </PageHeading>
          </div>

          <div>
            <Localized id={isMdcPublished ? "datasets-positioning-mdc" : "datasets-positioning"}>
              <p />
            </Localized>
          </div>
        </div>
        <div className="mars-container">
          <div className="speech-bubble-container">
            <Localized
              id="datasets-speech-bubble-content"
              elems={{
                discordLink: (
                  <a
                    href="https://discord.gg/4TjgEdq25Y"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
              }}>
              <p />
            </Localized>
          </div>
          <img
            src={require('./images/tail.svg')}
            alt=""
            className="speech-bubble-tail"
          />
          <img
            src={require('./images/waving-mars.svg')}
            alt=""
            className="hidden-sm-down"
          />
          <img
            src={require('./images/waving-mars-clipped.svg')}
            alt=""
            className="waving-mars-clipped"
          />
        </div>
      </div>
    </div>
  )
}

export default DatasetIntro
