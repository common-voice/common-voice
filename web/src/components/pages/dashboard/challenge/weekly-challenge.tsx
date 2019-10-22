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

export default function WeeklyChallenge() {
  let currentWeek = getCurrentWeek();
  let futureWeek: number = 0;
  if (currentWeek - 1 < 0) {
    futureWeek = currentWeek + 2;
  } else if (currentWeek + 1 >= WEEKS.length) {
    futureWeek = currentWeek - 2;
  }
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
            <img src={require('./images/star.svg')} alt="score" /> +50 points
          </p>
          <p>Way to send your first invite!</p>
        </div>
      </div>
      <div className="weekly-content">
        <div>
          <p className="weekly-title">Current challenge</p>
          <WeeklyChallengeBoard title={WEEKS[currentWeek]} week={currentWeek} />
        </div>
        {currentWeek < WEEKS.length - 1 && (
          <div>
            <p className="weekly-title">Next challenge</p>
            <WeeklyChallengeBoard
              isDisabled
              title={WEEKS[currentWeek + 1]}
              week={currentWeek + 1}
            />
          </div>
        )}
        <div>
          <p className="weekly-title">Past/Futrue challenge</p>
          <WeeklyChallengeBoard
            isDisabled
            title={WEEKS[futureWeek]}
            week={futureWeek}
          />
        </div>
      </div>
    </div>
  );
}
