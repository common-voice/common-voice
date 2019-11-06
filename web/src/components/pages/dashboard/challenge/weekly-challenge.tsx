import * as React from 'react';
import WeeklyChallengeBoard from './weekly-challenge-board';
import { useState, useEffect } from 'react';
import { useAccount, useAPI } from '../../../../hooks/store-hooks';
import { challengeLogoUrls, getWeekNum, pilotDates } from './constants';
import './weekly-challenge.css';

const WEEKS: Array<string> = [
  'Sign up and Contribute',
  "Let's get social",
  'Be the team with the highest sign up rate',
];

const getCurrentWeek = (): number => {
  let now = getWeekNum(new Date());
  let startWeek = getWeekNum(pilotDates.start);
  return now - startWeek;
};

export default function WeeklyChallenge({ isNarrow }: { isNarrow?: boolean }) {
  let currentWeek = getCurrentWeek();
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

  const api = useAPI();
  const account = useAccount();

  const [weekly, setWeekly] = useState({
    week: 1,
    user: {
      speak: 50,
      speak_total: 200,
      listen: 25,
      listen_total: 100,
    },
    team: {
      invite: 50,
      invite_total: 200,
    },
  });
  useEffect(() => {
    api.fetchWeeklyChallenge().then(setWeekly);
  }, []);
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
        <div className="week-points">
          <p>
            <img src={require('./images/star.svg')} alt="score" />
            <span>+50 points</span>
          </p>
          <p>Way to send your first invite!</p>
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
