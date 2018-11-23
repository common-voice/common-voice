import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { ALL_LOCALES } from '../../language-select/language-select';
import LanguagesBar from '../../languages-bar/languages-bar';
import ContributionActivity from './contribution-activity';
import Leaderboard from './leaderboard';
import ProgressCard from './progress-card';
import StatsCard from './stats-card';

import './dashboard.css';

interface State {
  locale: string;
}

class Dashboard extends React.Component<State> {
  state: State = { locale: ALL_LOCALES };

  handleLocaleChange = (locale: string) => {
    this.setState({ locale });
  };

  render() {
    const { locale } = this.state;

    return (
      <div className="dashboard-page">
        <div className="inner">
          <LanguagesBar
            locale={locale}
            onLocaleChange={this.handleLocaleChange}>
            <Localized id="stats">
              <h1 />
            </Localized>
          </LanguagesBar>

          <div className="cards">
            <ProgressCard key={'s' + locale} type="speak" locale={locale} />
            <ProgressCard key={'l' + locale} type="listen" locale={locale} />
          </div>
          <div className="cards">
            <StatsCard
              key="contribution"
              title="contribution-activity"
              tabs={['you', 'everyone'].reduce(
                (o: any, from: any) => ({
                  ...o,
                  [from]: ({ locale }: { locale: string }) => (
                    <ContributionActivity
                      key={locale + from}
                      {...{ from, locale }}
                    />
                  ),
                }),
                {}
              )}
            />
            <StatsCard
              key="leaderboard"
              title="top-contributors"
              tabs={{
                'recorded-clips': ({ locale }) => (
                  <Leaderboard key={'c' + locale} locale={locale} type="clip" />
                ),
                'validated-clips': ({ locale }) => (
                  <Leaderboard key={'v' + locale} locale={locale} type="vote" />
                ),
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
