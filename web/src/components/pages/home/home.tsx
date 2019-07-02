import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { trackHome } from '../../../services/tracker';
import { useTypedSelector } from '../../../stores/tree';
import URLS from '../../../urls';
import { CUSTOM_GOAL_LOCALE } from '../../custom-goal-lock';
import { ContributableLocaleLock } from '../../locale-helpers';
import { Banner } from '../../notification-banner/notification-banner';
import { RecordLink } from '../../primary-buttons/primary-buttons';
//import RegisterSection from '../../register-section/register-section';
import RequestLanguageModal from '../../request-language-modal/request-language-modal';
import { LinkButton } from '../../ui/ui';
import Hero from './hero';
import { ClipsStats, VoiceStats } from './stats';

import './home.css';

type HeroType = 'speak' | 'listen';

const GOALS_NOTIFICATION_KEY = 'seenGoalsNotification';

export default function HomePage() {
  const { account, heroes, isFetchingAccount, locale, user } = useTypedSelector(
    ({ flags, locale, user }) => ({
      account: user.account,
      heroes: flags.homeHeroes,
      isFetchingAccount: user.isFetchingAccount,
      locale,
      user,
    }),
    shallowEqual
  );

  const [showGoalsBanner, setShowGoalsBanner] = useState(false);
  const [activeHero, setActiveHero] = useState<null | HeroType>(null);
  const [showRequestLanguageModal, setShowRequestLanguageModal] = useState(
    false
  );
  const [showWallOfText, setShowWallOfText] = useState(false);

  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.hash == '#stats') {
      statsRef.current.scrollIntoView(true);
      window.scrollBy(0, -130);
    }

    if (
      locale == CUSTOM_GOAL_LOCALE &&
      !isFetchingAccount &&
      !(account && account.customGoal) &&
      !localStorage.getItem(GOALS_NOTIFICATION_KEY)
    ) {
      setShowGoalsBanner(true);
    }
  }, [account, isFetchingAccount, locale]);

  return (
    <div className="home">
      {showGoalsBanner && (
        <Banner
          className="goals-banner"
          ctaButtonProps={
            account
              ? { children: 'Get Started', to: URLS.GOALS }
              : { children: 'Log In / Sign Up', href: '/login' }
          }
          onClose={() => {
            setShowGoalsBanner(false);
            localStorage.setItem(GOALS_NOTIFICATION_KEY, JSON.stringify(true));
          }}>
          Help reach 10,000 hours in English, set a{' '}
          <a
            href="https://discourse.mozilla.org/t/common-voice-launches-personal-goals/38794"
            target="_blank">
            personal goal
          </a>
        </Banner>
      )}
      <ContributableLocaleLock
        render={({ isContributable }: any) =>
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
            <Localized id="home-title">
              <h1 />
            </Localized>
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
              <React.Fragment>
                <Localized id="wall-of-text-more-desktop">
                  <p />
                </Localized>
                <br />
              </React.Fragment>
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

      <div className="stats" ref={statsRef}>
        <ClipsStats.Root />
        <VoiceStats />
      </div>
      <section className="contribute-section">
        <div className="mars-container">
          <img src="/img/mars.svg" alt="Mars" />
        </div>
        <div className="cta">
          <ContributableLocaleLock
            render={({ isContributable }: any) =>
              isContributable ? (
                <>
                  <RecordLink onClick={() => trackHome('speak-mars', locale)} />
                  <Localized id="ready-to-record">
                    <h1 />
                  </Localized>
                </>
              ) : (
                <>
                  <Localized id="request-language-text">
                    <h1 />
                  </Localized>
                  <div style={{ width: '100%' }} />
                  <Localized id="request-language-button">
                    <button
                      type="button"
                      className="request-language"
                      onClick={() => setShowRequestLanguageModal(true)}
                    />
                  </Localized>
                  {showRequestLanguageModal && (
                    <RequestLanguageModal
                      onRequestClose={() => setShowRequestLanguageModal(false)}
                    />
                  )}
                </>
              )
            }
          />
        </div>
      </section>
    </div>
  );
}
