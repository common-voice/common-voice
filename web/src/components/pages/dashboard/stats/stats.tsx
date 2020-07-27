import * as React from 'react';
import Props from '../props';
import ContributionActivity from './contribution-activity';
import LeaderboardCard from './leaderboard-card';
import ProgressCard from './progress-card';
import StatsCard from './stats-card';

import './stats.css';

const StatsPage = ({ allGoals, dashboardLocale }: Props) =>
  allGoals ? (
    <div className="stats-page">
      <div className="cards">
        {['speak', 'listen'].map(type => {
          const [current, goals] = allGoals.globalGoals[
            type == 'speak' ? 'clips' : 'votes'
          ];
          return (
            <ProgressCard
              key={type + dashboardLocale}
              type={type as any}
              locale={dashboardLocale}
              personalCurrent={current}
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
          currentLocale={dashboardLocale}
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
        <LeaderboardCard currentLocale={dashboardLocale} />
      </div>
    </div>
  ) : null;

export default StatsPage;
