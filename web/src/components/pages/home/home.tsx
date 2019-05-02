import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { UserClient } from 'common/user-clients';
import { BENEFITS, WHATS_PUBLIC } from '../../../constants';
import { trackHome } from '../../../services/tracker';
import { Locale } from '../../../stores/locale';
import StateTree from '../../../stores/tree';
import { User } from '../../../stores/user';
import URLS from '../../../urls';
import { CUSTOM_GOAL_LOCALE } from '../../custom-goal-lock';
import { ContributableLocaleLock } from '../../locale-helpers';
import { Banner } from '../../notification-banner/notification-banner';
import { RecordLink } from '../../primary-buttons/primary-buttons';
import RequestLanguageModal from '../../request-language-modal/request-language-modal';
import { LinkButton } from '../../ui/ui';
import Hero from './hero';
import { ClipsStats, VoiceStats } from './stats';

import './home.css';

function RegisterSection(props: { locale: string }) {
  const { locale } = props;
  const [index, setIndex] = useState(0);
  const [tab, setTab] = useState('benefits');
  const isBenefits = tab == 'benefits';
  const info = (
    <div className="signup-info">
      <div className="tabs">
        <img
          className="waves"
          src={require('./images/signup-waves.png')}
          alt="Waves"
        />
        {['benefits', 'whats-public'].map(l => (
          <label key={l}>
            <input
              type="radio"
              name="tab"
              checked={tab == l}
              onChange={() => {
                setTab(l);
                setIndex(0);
                trackHome('change-benefits-tabs', locale);
              }}
            />
            <Localized id={l}>
              <div />
            </Localized>
          </label>
        ))}
      </div>
      <div className="list-and-bg">
        <div className="bg" />
        <ul key={tab}>
          {(isBenefits ? BENEFITS : WHATS_PUBLIC).map((l, i) => (
            <li
              key={l}
              className={i == index ? 'active' : ''}
              onClick={() => {
                setIndex(i);
                trackHome(
                  isBenefits
                    ? 'click-benefits-item'
                    : 'click-whats-public-item',
                  locale
                );
              }}>
              <span>{i + 1}.</span>
              <Localized id={l}>
                <span />
              </Localized>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <section className="register-section">
      <div className="top">
        <div className="cta-container">
          <Localized id="help-make-dataset">
            <h1 />
          </Localized>
          <Localized id="profile-not-required">
            <h2 />
          </Localized>
          <Localized id="sign-up-account">
            <LinkButton
              rounded
              href="/login"
              onClick={() => trackHome('click-benefits-register', locale)}
            />
          </Localized>
          {info}
        </div>
        <div className="images-container">
          <img className="mars" src="/img/mars.svg" alt="Mars" />
          <img
            className="screenshot"
            src={require(`./images/${isBenefits ? 1 : 2}-${index + 1}.png`)}
            alt=""
          />
        </div>
      </div>
    </section>
  );
}

type HeroType = 'speak' | 'listen';

interface PropsFromState {
  account: UserClient;
  heroes: string[];
  isFetchingAccount: boolean;
  locale: Locale.State;
  user: User.State;
}

const GOALS_NOTIFICATION_KEY = 'seenGoalsNotification';

function HomePage({
  account,
  heroes,
  isFetchingAccount,
  locale,
  user,
}: PropsFromState) {
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

      {user.account ? (
        <section className="contribute-section">
          <div className="mars-container">
            <img src="/img/mars.svg" alt="Mars" />
          </div>
          <div className="cta">
            <ContributableLocaleLock
              render={({ isContributable }: any) =>
                isContributable ? (
                  <>
                    <RecordLink
                      onClick={() => trackHome('speak-mars', locale)}
                    />
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
                        onRequestClose={() =>
                          setShowRequestLanguageModal(false)
                        }
                      />
                    )}
                  </>
                )
              }
            />
          </div>
        </section>
      ) : (
        <RegisterSection locale={locale} />
      )}
    </div>
  );
}

export default connect<PropsFromState>(
  ({ flags, locale, user }: StateTree) => ({
    account: user.account,
    heroes: flags.homeHeroes,
    isFetchingAccount: user.isFetchingAccount,
    locale,
    user,
  })
)(HomePage);
