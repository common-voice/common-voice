import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { connect } from 'react-redux';
import { trackHomeNew } from '../../../services/tracker';
import { Locale } from '../../../stores/locale';
import StateTree from '../../../stores/tree';
import { ContributableLocaleLock } from '../../locale-helpers';
import { RecordLink } from '../../primary-buttons/primary-buttons';
import RequestLanguageModal from '../../request-language-modal/request-language-modal';
import Hero from './hero';
import { ClipsStats, VoiceStats } from './stats';

import './home.css';

type HeroType = 'speak' | 'listen';

interface PropsFromState {
  locale: Locale.State;
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
    const { locale } = this.props;
    const { activeHero, showRequestLanguageModal, showWallOfText } = this.state;
    return (
      <div className="home">
        <ContributableLocaleLock
          render={({ isContributable }: any) =>
            isContributable ? (
              <div className="heroes">
                {['speak', 'listen'].map((type: HeroType) => (
                  <Hero
                    key={type}
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
                    trackHomeNew('read-more', locale);
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

        <div className="mars">
          <div className="mars-container">
            <img src="/img/mars.svg" alt="Mars" />
          </div>
          <div className="cta">
            <ContributableLocaleLock
              render={({ isContributable }: any) =>
                isContributable ? (
                  <React.Fragment>
                    <RecordLink onClick={() => trackHomeNew('speak', locale)} />
                    <Localized id="ready-to-record">
                      <h1 />
                    </Localized>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
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
                  </React.Fragment>
                )
              }
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect<PropsFromState>(({ locale }: StateTree) => ({ locale }))(
  HomePage
);
