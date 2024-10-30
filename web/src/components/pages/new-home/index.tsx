import React from 'react'
import { Localized } from '@fluent/react'

import Page from '../../ui/page'
import { Button } from '../../ui/ui'
import { ArrowRight, MicIcon, Play } from '../../ui/icons'
import { LocaleLink } from '../../locale-helpers'

import URLS from '../../../urls'

import './home.css'

const Home = () => {
  return (
    <Page className="home">
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
                <Button rounded />
              </Localized>
            </div>
          </div>
          <div className="hero-image-container">
            <div className="buttons">
              <div className="listen-container">
                <LocaleLink className="listen" to={URLS.LISTEN}>
                  <Play />
                </LocaleLink>
                <div className="background" />
              </div>
              <LocaleLink className="speak" to={URLS.SPEAK}>
                <MicIcon />
              </LocaleLink>
            </div>
            <img
              src={require('./assets/hero-hd.jpg')}
              alt="Hero"
              className="hero"
            />
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
    </Page>
  )
}

export default Home
