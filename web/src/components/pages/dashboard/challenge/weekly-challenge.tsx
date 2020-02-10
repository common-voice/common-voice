import * as React from 'react';
import WeeklyChallengeBoard from './weekly-challenge-board';
import { WeeklyChallenge } from 'common';
import { useAccount, useNotifications } from '../../../../hooks/store-hooks';
import NotificationPill from '../../../notification-pill/notification-pill';
import { FINAL_CHALLENGE_WEEK, weeklyChallengeCopy } from './constants';
import { ChevronDown } from '../../../ui/icons';
import './weekly-challenge.css';

export default function WeeklyChallenge({
  weekly,
}: {
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
  const notifications = useNotifications();

  return (
    <div className="weekly-container">
      <div className="weekly-topbar">
        <h2>Weekly Challenge</h2>
        <div className="weeks">
          <span className="week">Week</span>
          {weeklyChallengeCopy.map((_, index) => (
            <span
              key={index}
              className={`week-number ${
                currentWeek === index ? 'active' : ''
              }`}>
              {index + 1}
            </span>
          ))}
        </div>
        <div className="week-points">
          {notifications
            .map(
              notification =>
                notification.kind == 'pill' &&
                notification.type === 'achievement' && (
                  <NotificationPill
                    key={notification.id}
                    notification={notification}
                  />
                )
            )
            .reverse()}
        </div>
      </div>
      <div className="weekly-content">
        <div>
          <p className="weekly-title">Current challenge</p>
          {weekly && (
            <WeeklyChallengeBoard
              week={currentWeek}
              individualAvatarUrl={account.avatar_url}
              teamToken={account.enrollment.team}
              weekly={weekly}
            />
          )}
          <p className="challenge-dropdown">
            Show All Challenges <ChevronDown />
          </p>
        </div>
        {currentWeek < FINAL_CHALLENGE_WEEK && (
          <div>
            <p className="weekly-title">Next challenge</p>
            {weekly && (
              <WeeklyChallengeBoard
                isDisabled
                week={currentWeek + 1}
                individualAvatarUrl={account.avatar_url}
                teamToken={account.enrollment.team}
              />
            )}
          </div>
        )}
        <div>
          <p className="weekly-title">{`${
            currentWeek ? 'Past' : 'Future'
          } challenge${currentWeek === FINAL_CHALLENGE_WEEK ? 's' : ''}`}</p>
          {currentWeek === 0
            ? weekly && (
                <WeeklyChallengeBoard
                  isDisabled
                  week={currentWeek + 2}
                  individualAvatarUrl={account.avatar_url}
                  teamToken={account.enrollment.team}
                />
              )
            : pastWeek.map(
                (value, index) =>
                  weekly && (
                    <WeeklyChallengeBoard
                      isDisabled
                      week={value}
                      key={index}
                      individualAvatarUrl={account.avatar_url}
                      teamToken={account.enrollment.team}
                    />
                  )
              )}
        </div>
      </div>
    </div>
  );
}
