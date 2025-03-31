import * as React from 'react'
import { Localized } from '@fluent/react'
import { useState } from 'react'
import classNames from 'classnames'
import { TextButton } from '../../ui/ui'
import PageHeading from '../../ui/page-heading'

import './dataset-intro.css'

const DatasetIntro = () => {
  const [showIntroTextMdDown, setShow] = useState(false)

  return (
    <div className="dataset-intro">
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
          {!showIntroTextMdDown && (
            <Localized id="show-wall-of-text">
              <TextButton
                className="hidden-lg-up"
                onClick={() => setShow(true)}
              />
            </Localized>
          )}
          <Localized id="datasets-positioning">
            <p
              className={classNames({ 'hidden-md-down': !showIntroTextMdDown })}
            />
          </Localized>
        </div>
      </div>
      <div className="mars-container">
        <div className="speech-bubble-container">
          <Localized id="datasets-speech-bubble-content">
            <p />
          </Localized>
        </div>
        <img
          src={require('./images/tail.svg')}
          alt=""
          className="speech-bubble-tail"
        />
        <img src={require('./images/waving-mars.svg')} alt="" />
      </div>
    </div>
  )
}

export default DatasetIntro
