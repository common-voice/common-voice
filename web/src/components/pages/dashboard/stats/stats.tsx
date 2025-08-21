import * as React from 'react'
import Props from '../props'
import ContributionActivity from './contribution-activity'
import LeaderboardCard from './leaderboard-card'
import ProgressCard, { Props as ProgressCardProps } from './progress-card'
import StatsCard from './stats-card'

import './stats.css'

const StatsPage = ({ allGoals, dashboardLocale }: Props) => {
  if (!allGoals) {
    return null
  }

  const ContributionActivityYou = ({ locale }: { locale: string }) => (
    <ContributionActivity from="you" locale={locale} key={'you_' + locale} />
  )
  const ContributionActivityEveryone = ({ locale }: { locale: string }) => (
    <ContributionActivity
      from="everyone"
      locale={locale}
      key={'everyone_' + locale}
    />
  )

  return (
    <div className="stats-page">
      <div className="cards">
        {['speak', 'listen'].map(type => {
          const [current, goals] =
            allGoals.globalGoals[type == 'speak' ? 'clips' : 'votes']
          return (
            <ProgressCard
              key={type + dashboardLocale}
              type={type as ProgressCardProps['type']}
              locale={dashboardLocale}
              personalCurrent={current}
              personalGoal={
                allGoals
                  ? (goals.find(g => !g.date) || { goal: Infinity }).goal
                  : null
              }
            />
          )
        })}
      </div>

      <div className="cards">
        <StatsCard
          id="stats-contribution"
          scrollable
          title="contribution-activity"
          currentLocale={dashboardLocale}
          tabs={{
            you: ContributionActivityYou,
            everyone: ContributionActivityEveryone,
          }}
        />
        <LeaderboardCard currentLocale={dashboardLocale} />
      </div>
    </div>
  )
}

export default StatsPage
