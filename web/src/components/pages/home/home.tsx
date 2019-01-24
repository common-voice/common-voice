import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { connect } from 'react-redux';
import { BENEFITS, WHATS_PUBLIC } from '../../../constants';
import { trackHome } from '../../../services/tracker';
import { Locale } from '../../../stores/locale';
import StateTree from '../../../stores/tree';
import { User } from '../../../stores/user';
import { ContributableLocaleLock } from '../../locale-helpers';
import { RecordLink } from '../../primary-buttons/primary-buttons';
import RequestLanguageModal from '../../request-language-modal/request-language-modal';
import { LinkButton } from '../../ui/ui';
import Hero from './hero';
import { ClipsStats, VoiceStats } from './stats';

import './home.css';

interface RegisterState {
  tab: 'benefits' | 'whats-public';
  index: number;
}

class RegisterSection extends React.Component<
  { locale: string },
  RegisterState
> {
  state: RegisterState = { tab: 'benefits', index: 0 };

  render() {
    const { locale } = this.props;
    const { index, tab } = this.state;
    const isBenefits = tab == 'benefits';
    const info = (
      <div className="signup-info">
        <div className="tabs">
          <img className="waves" src="/img/signup-waves.png" alt="Waves" />
          {['benefits', 'whats-public'].map(l => (
            <label key={l}>
              <input
                type="radio"
                name="tab"
                checked={tab == l}
                onChange={() => {
                  this.setState({ tab: l as any, index: 0 });
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
                  this.setState({ index: i });
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
              src={`/img/screenshots/${isBenefits ? 1 : 2}-${index + 1}.png`}
              alt=""
            />
          </div>
        </div>
      </section>
    );
  }
}

type HeroType = 'speak' | 'listen';

interface PropsFromState {
  locale: Locale.State;
  user: User.State;
}

type State = {
  activeHero: null | HeroType;
  showRequestLanguageModal: boolean;
  showWallOfText: boolean;
};

class HomePage extends React.Component<PropsFromState, State> {
  state: State = {
    activeHero: null,
    showRequestLanguageModal: false,
    showWallOfText: false,
  };

  statsRef: React.RefObject<HTMLDivElement> = React.createRef();

  componentDidMount() {
    if (location.hash == '#stats') {
      this.statsRef.current.scrollIntoView(true);
      window.scrollBy(0, -130);
    }
  }

  showHandlerFor = (hero: HeroType) => () =>
    this.setState({ activeHero: hero });
  hideHandlerFor = (hero: HeroType) => () =>
    this.setState(({ activeHero }) => ({
      activeHero: activeHero === hero ? null : activeHero,
    }));

  render() {
    const { locale, user } = this.props;
    const { activeHero, showRequestLanguageModal, showWallOfText } = this.state;
    return (
      <div className="home">
        <ContributableLocaleLock
          render={({ isContributable }: any) =>
            isContributable ? (
              <div className="heroes">
                {['speak', 'listen'].map((type: HeroType) => (
                  <Hero
                    key={type + locale}
                    type={type}
                    status={
                      activeHero === type
                        ? 'active'
                        : activeHero
                        ? 'compressed'
                        : null
                    }
                    onShow={this.showHandlerFor(type)}
                    onHide={this.hideHandlerFor(type)}
                  />
                ))}
              </div>
            ) : (
              <div className="non-contributable-hero">
                <img className="fading" src="/img/fading.svg" alt="Fading" />
                <img
                  className="waves"
                  src="/img/home-waves/speak.svg"
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
                id={
                  showWallOfText ? 'languages-show-less' : 'show-wall-of-text'
                }>
                <button
                  className="show-more"
                  type="button"
                  onClick={() => {
                    this.setState({ showWallOfText: !showWallOfText });
                    trackHome('read-more', locale);
                  }}
                />
              </Localized>
            </div>
          </div>
        </div>

        <div className="stats" ref={this.statsRef}>
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
                      <RecordLink onClick={() => trackHome('speak', locale)} />
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
                          onClick={() =>
                            this.setState({ showRequestLanguageModal: true })
                          }
                        />
                      </Localized>
                      {showRequestLanguageModal && (
                        <RequestLanguageModal
                          onRequestClose={() =>
                            this.setState({ showRequestLanguageModal: false })
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
}

export default connect<PropsFromState>(({ locale, user }: StateTree) => ({
  locale,
  user,
}))(HomePage);
