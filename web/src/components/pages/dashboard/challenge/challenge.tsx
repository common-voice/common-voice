import * as React from 'react';
import Props from '../props';
import WeeklyChallenge from './weekly-challenge';
import './challenge.css';

export default function ChallengePage({ dashboardLocale }: Props) {
  return (
    <div className="challenge challenge-container">
      <WeeklyChallenge />
      <div className="range-container"></div>
    </div>
  );
}
