import * as React from 'react';
import * as moment from 'moment';
import WeeklyChallengeBoard from './weekly-challenge-board';
import './weekly-challenge.css';

const WEEKS: Array<string> = [
  'Sign up and Contribute',
  "Let's get social",
  'Be the team with the highest sign up rate',
];
const START_DATE: string = '10/21/2019';

const getCurrentWeek = (): number => {
  let now = moment().week();
  let startWeek = moment(START_DATE).week();
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
          <WeeklyChallengeBoard
            title={WEEKS[currentWeek]}
            week={currentWeek}
            isNarrow={isNarrow}
          />
        </div>
        {pastWeek.length !== WEEKS.length - 1 && (
          <div>
            <p className="weekly-title">Next challenge</p>
            <WeeklyChallengeBoard
              isDisabled
              title={WEEKS[currentWeek + 1]}
              week={currentWeek + 1}
              isNarrow={isNarrow}
            />
          </div>
        )}
        <div>
          <p className="weekly-title">{label} challenge</p>
          {label === 'Future' ? (
            <WeeklyChallengeBoard
              isDisabled
              title={WEEKS[currentWeek + 2]}
              week={currentWeek + 2}
              isNarrow={isNarrow}
            />
          ) : (
            pastWeek.map((value, index) => (
              <WeeklyChallengeBoard
                isDisabled
                title={WEEKS[value]}
                week={value}
                key={index}
                isNarrow={isNarrow}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
