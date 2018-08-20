import { Localized } from 'fluent-react';
import * as React from 'react';
import Hero from './hero';
import { ClipsStats, VoiceStats } from './stats';

import './home.css';

type HeroType = 'speak' | 'listen';

type State = { activeHero: null | HeroType; showWallOfText: boolean };

export default class HomePage extends React.Component<{}, State> {
  state: State = { activeHero: null, showWallOfText: false };

  showHandlerFor = (hero: HeroType) => () =>
    this.setState({ activeHero: hero });
  hideHandlerFor = (hero: HeroType) => () =>
    this.setState(({ activeHero }) => ({
      activeHero: activeHero === hero ? null : activeHero,
    }));

  render() {
    const { activeHero, showWallOfText } = this.state;
    return (
      <div className="home">
        <div className="heroes">
          {['speak', 'listen'].map((type: HeroType) => (
            <Hero
              key={type}
              type={type}
              status={
                activeHero === type
                  ? 'active'
                  : activeHero ? 'compressed' : null
              }
              onShow={this.showHandlerFor(type)}
              onHide={this.hideHandlerFor(type)}
            />
          ))}
        </div>

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
                  <Localized id="wall-of-text-more-desktop" lineBreak={<br />}>
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
                  onClick={() =>
                    this.setState({ showWallOfText: !showWallOfText })
                  }
                />
              </Localized>
            </div>
          </div>
        </div>

        <div className="stats">
          <ClipsStats.Root />
          <VoiceStats.Root />
        </div>
      </div>
    );
  }
}
