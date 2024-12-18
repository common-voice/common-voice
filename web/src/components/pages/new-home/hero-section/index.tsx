/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react'
import { Localized } from '@fluent/react'
import classNames from 'classnames'

import { LinkButton } from '../../../ui/ui'
import { ArrowRight, MicIcon, Play } from '../../../ui/icons'

import { LocaleLink } from '../../../locale-helpers'
import URLS from '../../../../urls'

import { usePreloadImage } from '../../../../hooks/use-preload-image'

import './hero-section.css'

type Props = {
  isLocaleContributable: boolean
}

export const HeroSection: React.FC<Props> = ({ isLocaleContributable }) => {
  const imageUrl = require('./assets/hero-hd.jpg')
  const isLoaded = usePreloadImage(imageUrl)

  const linkDisabled = !isLocaleContributable

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-text-wrapper">
          <div className="hero-text-container">
            <Localized id="hero-title">
              <h1 />
            </Localized>
            <Localized id="hero-subtitle-1" elems={{ bold: <b /> }}>
              <p />
            </Localized>
            <Localized id="hero-subtitle-2">
              <p />
            </Localized>
            <Localized id="get-started" elems={{ icon: <ArrowRight /> }}>
              <LinkButton
                rounded
                to={`${URLS.NEW_ROOT}?page=home#get-involved`}
              />
            </Localized>
          </div>
        </div>
        <div className="hero-image-container">
          <div
            className="hero-background"
            style={{ backgroundImage: isLoaded ? `url(${imageUrl})` : 'none' }}>
            <div className="buttons">
              <div className="listen-container">
                <LocaleLink
                  className={classNames('listen', {
                    disabled: linkDisabled,
                  })}
                  to={URLS.LISTEN}>
                  <Play />
                </LocaleLink>
                <div className="background" />
              </div>
              <LocaleLink
                className={classNames('speak', { disabled: linkDisabled })}
                to={URLS.SPEAK}>
                <MicIcon />
              </LocaleLink>
            </div>
          </div>
          <div className="sound-waves-container">
            <img
              src={require('./assets/sound-waves-1.png')}
              alt="Sound waves"
              className="sound-waves"
            />
            <img
              src={require('./assets/sound-waves-2.png')}
              alt="Sound waves"
              className="sound-waves"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
