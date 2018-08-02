import { Localized } from 'fluent-react';
import * as React from 'react';
import Hero from './hero';

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
          {[['speak', 5], ['listen', 10]].map(
            ([type, count]: [HeroType, number]) => (
              <Hero
                key={type}
                type={type}
                count={count}
                isActive={activeHero === type}
                onShow={this.showHandlerFor(type)}
                onHide={this.hideHandlerFor(type)}
              />
            )
          )}
        </div>
        <div className="text">
          <div className="inner">
            <div className="title">
              <Localized id="home-title">
                <h1 />
              </Localized>
            </div>

            <div className="description">
              <Localized id="wall-of-text-start">
                <p />
              </Localized>

              <br />

              <Localized id="wall-of-text-more-mobile">
                <p />
              </Localized>

              <br />

              {showWallOfText ? (
                <Localized id="wall-of-text-more-desktop" lineBreak={<br />}>
                  <p />
                </Localized>
              ) : (
                <Localized id="show-wall-of-text">
                  <button
                    className="show-more"
                    type="button"
                    onClick={() => this.setState({ showWallOfText: true })}
                  />
                </Localized>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
