import * as React from 'react';
import WeeklyChallengeBoard from './weekly-challenge-board';
import { WeeklyChallenge } from 'common/challenge';
import { useAccount } from '../../../../hooks/store-hooks';
import { challengeLogoUrls } from './constants';
import './weekly-challenge.css';

const WEEKS: Array<string> = [
  'Sign up and Contribute',
  "Let's get social",
  'Be the team with the highest sign up rate',
];

export default function WeeklyChallenge({
  isNarrow,
  weekly,
}: {
  isNarrow?: boolean;
  weekly?: WeeklyChallenge;
}) {
  let currentWeek = weekly.week;
  let pastWeek: Array<number> = [];
  switch (currentWeek) {
    case 0:
      break;
    case 1:
      pastWeek.push(currentWeek - 1);
      break;
    case 2:
      pastWeek.push(currentWeek - 1);
      pastWeek.push(currentWeek - 2);
      break;
  }
  const label = pastWeek.length === 0 ? 'Future' : 'Past';
  const account = useAccount();

  return (
    <div className="weekly-container">
      <div className="weekly-topbar">
        <h2>Weekly Challenge</h2>
        <div className="weeks">
          <span className="week">Week</span>
          {WEEKS.map((title, index) => (
            <span
              key={index}
              className={`week-number ${
                currentWeek === index ? 'active' : ''
              }`}>
              {++index}
            </span>
          ))}
        </div>
      </div>
      <div className="weekly-content">
        <div>
          <p className="weekly-title">Current challenge</p>
          {weekly && (
            <WeeklyChallengeBoard
              title={WEEKS[currentWeek]}
              week={currentWeek}
              isNarrow={isNarrow}
              avatarUrl={account.avatar_url}
              logoUrl={challengeLogoUrls[account.enrollment.team]}
              weekly={weekly}
            />
          )}
        </div>
        {pastWeek.length !== WEEKS.length - 1 && (
          <div>
            <p className="weekly-title">Next challenge</p>
            {weekly && (
              <WeeklyChallengeBoard
                isDisabled
                title={WEEKS[currentWeek + 1]}
                week={currentWeek + 1}
                isNarrow={isNarrow}
                avatarUrl={account.avatar_url}
                logoUrl={challengeLogoUrls[account.enrollment.team]}
                weekly={weekly}
              />
            )}
          </div>
        )}
        <div>
          <p className="weekly-title">{label} challenge</p>
          {label === 'Future'
            ? weekly && (
                <WeeklyChallengeBoard
                  isDisabled
                  title={WEEKS[currentWeek + 2]}
                  week={currentWeek + 2}
                  isNarrow={isNarrow}
                  avatarUrl={account.avatar_url}
                  logoUrl={challengeLogoUrls[account.enrollment.team]}
                  weekly={weekly}
                />
              )
            : pastWeek.map(
                (value, index) =>
                  weekly && (
                    <WeeklyChallengeBoard
                      isDisabled
                      title={WEEKS[value]}
                      week={value}
                      key={index}
                      isNarrow={isNarrow}
                      avatarUrl={account.avatar_url}
                      logoUrl={challengeLogoUrls[account.enrollment.team]}
                      weekly={weekly}
                    />
                  )
              )}
        </div>
      </div>
    </div>
  );
}
