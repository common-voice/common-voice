import { Localized } from '@fluent/react';
import * as React from 'react';
import { useState } from 'react';
import { shallowEqual } from 'react-redux';
import classNames from 'classnames';

import { trackHome } from '../../../services/tracker';
import { useTypedSelector } from '../../../stores/tree';
import { ContributableLocaleLock } from '../../locale-helpers';
import { RecordLink } from '../../primary-buttons/primary-buttons';
import { LinkButton } from '../../ui/ui';
import Page from '../../ui/page';
import Hero from './hero';
import { DonateBanner } from '../../donate-banner/donate-banner';
import { ClipsStats, VoiceStats } from './stats';
import URLS from '../../../urls';
import { useDonateBanner } from '../../../hooks/store-hooks';

import './home.css';

type HeroType = 'speak' | 'listen';

export default function HomePage() {
  const heroes = ['speak', 'listen'];

  const { locale, user } = useTypedSelector(
    ({ locale, user }) => ({
      locale,
      user,
    }),
    shallowEqual
  );

  const donateBanner = useDonateBanner();

  const [activeHero, setActiveHero] = useState<null | HeroType>(null);
  const [showWallOfText, setShowWallOfText] = useState(false);

  return (
    <Page className="home">
      <ContributableLocaleLock
        render={({ isContributable }: { isContributable: boolean }) =>
          isContributable ? (
            <div
              className={
                'heroes ' + (heroes.length > 1 ? 'multiple' : 'single')
              }>
              {heroes.map((type: HeroType) => (
                <Hero
                  key={type + locale}
                  type={type}
                  status={
                    heroes.length == 1 || activeHero === type
                      ? 'active'
                      : activeHero
                      ? 'compressed'
                      : null
                  }
                  onShow={() => setActiveHero(type)}
                  onHide={() =>
                    setActiveHero(activeHero === type ? null : activeHero)
                  }
                />
              ))}
            </div>
          ) : (
            <div className="non-contributable-hero">
              <img
                className="fading"
                src={require('./images/fading.svg')}
                alt="Fading"
              />
              <img
                className="waves"
                src={require('./images/speak.svg')}
                alt="Waves"
              />
            </div>
          )
        }
      />
      <div className="text">
        <div className="inner">
          <div className="title">
            <h1>
              <Localized id="default-tagline" />
            </h1>
          </div>

          <div className="description">
            <Localized id="wall-of-text-first">
              <p />
            </Localized>

            <br />

            <Localized id="wall-of-text-second">
              <p />
            </Localized>

            <br />

            {showWallOfText && (
              <>
                <Localized id="wall-of-text-more-desktop">
                  <p />
                </Localized>
                <br />
              </>
            )}

            <Localized
              id={showWallOfText ? 'languages-show-less' : 'show-wall-of-text'}>
              <button
                className="show-more"
                type="button"
                onClick={() => {
                  if (showWallOfText) {
                    trackHome('read-more', locale);
                  }
                  setShowWallOfText(!showWallOfText);
                }}
              />
            </Localized>
          </div>
        </div>
      </div>
      <div className={classNames('stats', { 'logged-in': user.account })}>
        <ClipsStats.Root />
        <VoiceStats />
      </div>

      {user.account && (
        <section className="contribute-section">
          <div className="mars-container">
            <img src="/img/mars.svg" alt="Mars" />
          </div>
          <div className="cta">
            <ContributableLocaleLock
              render={({ isContributable }: { isContributable: boolean }) =>
                isContributable ? (
                  <>
                    <RecordLink
                      onClick={() => trackHome('speak-mars', locale)}
                    />
                    <h1>
                      <Localized id="ready-to-record" />
                    </h1>
                  </>
                ) : (
                  <>
                    <h1>
                      <Localized id="request-language-text" />
                    </h1>
                    <div style={{ width: '100%' }} />
                    <Localized id="request-language-button">
                      <LinkButton
                        type="button"
                        className="request-language"
                        to={URLS.LANGUAGE_REQUEST}
                      />
                    </Localized>
                  </>
                )
              }
            />
          </div>
        </section>
      )}

      <section className="donate-banner-section">
        <DonateBanner background={donateBanner.colour} />
      </section>
    </Page>
  );
}
