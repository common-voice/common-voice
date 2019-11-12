import * as React from 'react';
import { LocaleLink } from '../../../locale-helpers';
import { CircleProgress, Fraction } from '../../../pages/dashboard/ui';
import { WeeklyChallenge, ChallengeTeamToken } from 'common/challenge';
import { Avatar } from '../../../ui/ui';
import URLS from '../../../../urls';
import TeamAvatar from './team-avatar';
import './weekly-challenge-board.css';

export default function WeeklyChallengeBoard({
  isDisabled,
  title,
  week,
  individualAvatarUrl,
  teamToken,
  weekly,
}: {
  isDisabled?: boolean;
  title: string;
  week: number;
  individualAvatarUrl: string;
  teamToken: ChallengeTeamToken;
  weekly: WeeklyChallenge;
}) {
  const { user, team } = weekly;
  return (
    <div className={`challenge-board ${isDisabled ? 'disabled' : ''}`}>
      <div className="title-container">
        <img
          className="icon"
          src={
            isDisabled
              ? require('./images/stars-disabled.svg')
              : require('./images/stars.svg')
          }
          alt=""
          role="presentation"
        />
        <p className="title">{title}</p>
        <div className="week-container">week {++week}</div>
      </div>
      {!isDisabled && (
        <div className="challenge-board-content">
          <div className="content-row">
            <div className="column avatar-container">
              <Avatar url={individualAvatarUrl ? individualAvatarUrl : ''} />
              <p>individual</p>
            </div>
            <div className="column challenge-stats">
              <div className="container">
                <LocaleLink className="speak-btn" to={URLS.SPEAK}>
                  Speak
                  <span className="speak-icon"></span>
                </LocaleLink>
                <CircleProgress
                  className="speak-bar progress-desktop"
                  value={user.speak}
                  denominator={user.speak_total}
                  strokeW={4}
                  radius={66}
                />
                <Fraction
                  numerator={user.speak}
                  denominator={user.speak_total}
                  className="speak-bar progress-mobile"
                />
              </div>
              <div className="divider" />
              <div className="container">
                <LocaleLink className="listen-btn" to={URLS.LISTEN}>
                  Listen
                  <span className="listen-icon"></span>
                </LocaleLink>
                <CircleProgress
                  className="listen-bar progress-desktop"
                  value={user.listen}
                  denominator={user.listen_total}
                  strokeW={4}
                  radius={66}
                />
                <Fraction
                  numerator={user.listen}
                  denominator={user.listen_total}
                  className="listen-bar progress-mobile"
                />
              </div>
            </div>
          </div>
          <div className="content-row">
            <div className="column avatar-container">
              <TeamAvatar team={teamToken} />
              <p>Team</p>
            </div>
            <div className="column challenge-stats team-stats">
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
              <div className="container invite">
                <CircleProgress
                  className="team-bar progress-desktop"
                  value={team.invite / team.invite_total}
                  strokeW={4}
                  radius={66}
                />
                <Fraction
                  numerator={(100 * team.invite) / team.invite_total}
                  className="team-bar progress-mobile"
                  percentage
                />
                <p className="team-invite-total">
                  of {team.invite_total} invites
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
