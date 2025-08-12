import * as React from 'react'
import { Localized } from '@fluent/react'

import PageHeading from '../../ui/page-heading'

import './dataset-intro.css'

const DatasetIntro = () => {
  return (
    <div className="dataset-intro">
      <div className="content-wrapper">
        <div className="heading-and-intro-container">
          <div>
            <PageHeading isLight>
              <Localized id="datasets-heading" />
              <p className="intro-summary">
                <Localized id="datasets-headline" />
              </p>
            </PageHeading>
          </div>

          <div>
            <Localized id="datasets-positioning">
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
