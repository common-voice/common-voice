import * as React from 'react';
import { LocaleLink } from '../../../locale-helpers';
import BalanceText from 'react-balance-text';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import URLS from '../../../../urls';
import './weekly-challenge-board.css';

interface TeamInfo {
  id: number;
  name: string;
  logo: string;
}
type teamType = TeamInfo;

export default function WeeklyChallengeBoard({
  isDisabled,
  title,
  week,
  team,
}: {
  isDisabled?: boolean;
  title: string;
  week: number;
  team?: teamType;
}) {
  const percentage = 66;
  return (
    <div className={`challenge-board ${isDisabled ? 'disabled' : ''}`}>
      <div className="title-container">
        <div className="icon">
          <img
            src={
              isDisabled
                ? require('./stars-disabled.svg')
                : require('../awards/stars.svg')
            }
            alt="stars"
          />
        </div>
        <p className="title">{title}</p>
        <div className="week-container">week {++week}</div>
      </div>
      {!isDisabled && (
        <div className="challenge-board-content">
          <div className="content-row">
            <div className="column">
              <img src={require('./ava.svg')} alt="ava" />
              <p>individual</p>
            </div>
            <div className="container">
              <LocaleLink className="speak-btn" to={URLS.SPEAK}>
                Speak
                <span className="speak-icon"></span>
              </LocaleLink>
              <CircularProgressbarWithChildren
                className="speak-bar"
                value={25}
                strokeWidth={4}>
                <div className="speak-content">
                  <span className="first">50</span>
                  <span className="total">/200</span>
                </div>
              </CircularProgressbarWithChildren>
            </div>
            <div className="divider" />
            <div className="container">
              <LocaleLink className="listen-btn" to={URLS.LISTEN}>
                Listen
                <span className="listen-icon"></span>
              </LocaleLink>
              <CircularProgressbarWithChildren
                className="listen-bar"
                value={25}
                strokeWidth={4}>
                <div className="listen-content">
                  <span className="first">50</span>
                  <span className="total">/200</span>
                </div>
              </CircularProgressbarWithChildren>
            </div>
          </div>
          <div className="content-row">
            <div className="column">
              <img src={require('./ava.svg')} alt="team" />
              <p>Team</p>
            </div>
            <div className="container team">
              <p className="team-text">
                Win a prize by being the team with the highest sign up rate
              </p>
              <div className="v-divider" />
              <p className="team-invite">
                The is the percentage of team invites that have been accepted
                out of the current total sent.
              </p>
            </div>
            <div className="container">
              <CircularProgressbarWithChildren
                className="team-bar"
                value={25}
                strokeWidth={4}>
                <div className="team-content">
                  <span className="first">25</span>
                  <span className="total">%</span>
                </div>
              </CircularProgressbarWithChildren>
              <p className="team-invite-total">of 50 invites</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
