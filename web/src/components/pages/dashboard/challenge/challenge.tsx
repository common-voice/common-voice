import * as React from 'react';
import Props from '../props';
import WeeklyChallenge from './weekly-challenge';
import LeaderBoardCard from './leaderboard-card';
import './challenge.css';

export default function ChallengePage({ dashboardLocale }: Props) {
  return (
    <div className="challenge challenge-container">
      <WeeklyChallenge />
      <div className="range-container">
        <div>
          <LeaderBoardCard title="SAP Team Progress" />
        </div>
        <div className="leader-board">
          <LeaderBoardCard title="Overall Challenge Top Team" />
        </div>
        <div className="leader-board">
          <LeaderBoardCard title="Overall Challenge Top Contributors" />
        </div>
      </div>
    </div>
  );
}
