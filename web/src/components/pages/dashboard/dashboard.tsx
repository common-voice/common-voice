import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { connect } from 'react-redux';
import { AllGoals } from 'common/goals';
import API from '../../../services/api';
import StateTree from '../../../stores/tree';
import { User } from '../../../stores/user';
import { ALL_LOCALES } from '../../language-select/language-select';
import LanguagesBar from '../../languages-bar/languages-bar';
import ContributionActivity from './contribution-activity';
import LeaderboardCard from './leaderboard-card';
import ProgressCard from './progress-card';
import StatsCard from './stats-card';

import './dashboard.css';

interface PropsFromState {
  api: API;
  user: User.State;
}

interface State {
  allGoals: AllGoals;
  locale: string;
}

class Dashboard extends React.Component<PropsFromState, State> {
  state: State = { allGoals: null, locale: ALL_LOCALES };

  async componentDidMount() {
    if (!this.props.user.account) {
      window.location.href = '/';
    }
    await this.fetchGoals(this.state.locale);
  }

  handleLocaleChange = async (locale: string) => {
    this.setState({ locale });
    await this.fetchGoals(locale);
  };

  fetchGoals = async (locale: string) => {
    this.setState({
      allGoals: await this.props.api.fetchGoals(
        locale == ALL_LOCALES ? null : locale
      ),
    });
  };

  render() {
    const { allGoals, locale } = this.state;
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
            {['speak', 'listen'].map(type => {
              const [current, goals] = allGoals
                ? allGoals[type == 'speak' ? 'clips' : 'votes']
                : [null, null];
              return (
                <ProgressCard
                  key={type + locale}
                  type={type as any}
                  locale={locale}
                  personalCurrent={allGoals ? current : null}
                  personalGoal={
                    allGoals
                      ? (goals.find(g => !g.date) || { goal: Infinity }).goal
                      : null
                  }
                />
              );
            })}
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
            <LeaderboardCard />
          </div>
        </div>
      </div>
    );
  }
}

export default connect<PropsFromState>(({ api, user }: StateTree) => ({
  api,
  user,
}))(Dashboard);
