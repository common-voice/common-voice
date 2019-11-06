import * as React from 'react';
import * as moment from 'moment';
import WeeklyChallengeBoard from './weekly-challenge-board';
import { WeeklyChallenge } from '../../../../../../common/challenge';
import { Notifications } from '../../../../stores/notifications';
import API from '../../../../services/api';
import { User } from '../../../../stores/user';
import StateTree from '../../../../stores/tree';
import { connect } from 'react-redux';
import NotificationPill from '../../../notification-pill/notification-pill';
import { challengeLogoUrls } from './constants';
import './weekly-challenge.css';

const WEEKS: Array<string> = [
  'Sign up and Contribute',
  "Let's get social",
  'Be the team with the highest sign up rate',
];
const START_DATE: string = '10/21/2019';

interface PropsFromState {
  api: API;
  user: User.State;
  notifications: Notifications.State;
}

interface Props extends PropsFromState {
  isNarrow?: boolean;
}

interface State {
  weekly: WeeklyChallenge;
}

class WeeklyChallengeCard extends React.Component<Props, State> {
  state: State = {
    weekly: null,
  };
  getCurrentWeek = (): void => {
    let now = moment().week();
    let startWeek = moment(START_DATE).week();
    this.currentWeek = now - startWeek;
    switch (this.currentWeek) {
      case 0:
        break;
      case 1:
        this.pastWeek.push(this.currentWeek - 1);
        break;
      case 2:
        this.pastWeek.push(this.currentWeek - 1);
        this.pastWeek.push(this.currentWeek - 2);
        break;
    }
  };
  currentWeek = 0;
  pastWeek: Array<number> = [];

  label = this.pastWeek.length === 0 ? 'Future' : 'Past';

  componentDidMount() {
    const { api } = this.props;
    api.fetchWeeklyChallenge().then(weekly => {
      this.setState({ weekly: weekly });
    });
  }
  render() {
    this.getCurrentWeek();
    const { weekly } = this.state;
    const { isNarrow, user, notifications } = this.props;
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
                  this.currentWeek === index ? 'active' : ''
                }`}>
                {++index}
              </span>
            ))}
          </div>
          <div className="week-points">
            {notifications
              .slice()
              .reverse()
              .map(
                notification =>
                  notification.kind == 'pill' &&
                  notification.type == 'achievement' && (
                    <NotificationPill
                      key={notification.id}
                      {...{ notification }}
                    />
                  )
              )}
          </div>
          <div className="weekly-content">
            <div>
              <p className="weekly-title">Current challenge</p>
              {weekly && (
                <WeeklyChallengeBoard
                  title={WEEKS[this.currentWeek]}
                  week={this.currentWeek}
                  isNarrow={isNarrow}
                  avatarUrl={user.account.avatar_url}
                  logoUrl={challengeLogoUrls[user.account.enrollment.team]}
                  weekly={weekly}
                />
              )}
            </div>
          </div>
          <div className="weekly-content">
            <div>
              <p className="weekly-title">Current challenge</p>
              {weekly && (
                <WeeklyChallengeBoard
                  title={WEEKS[this.currentWeek]}
                  week={this.currentWeek}
                  isNarrow={isNarrow}
                  avatarUrl={user.account.avatar_url}
                  logoUrl={challengeLogoUrls[user.account.enrollment.team]}
                  weekly={weekly}
                />
              )}
            </div>
            {this.pastWeek.length !== WEEKS.length - 1 && (
              <div>
                <p className="weekly-title">Next challenge</p>
                {weekly ? (
                  <WeeklyChallengeBoard
                    isDisabled
                    title={WEEKS[this.currentWeek + 1]}
                    week={this.currentWeek + 1}
                    isNarrow={isNarrow}
                    avatarUrl={user.account.avatar_url}
                    logoUrl={challengeLogoUrls[user.account.enrollment.team]}
                    weekly={weekly}
                  />
                ) : (
                  this.pastWeek.map(
                    (value, index) =>
                      weekly && (
                        <WeeklyChallengeBoard
                          isDisabled
                          title={WEEKS[value]}
                          week={value}
                          key={index}
                          isNarrow={isNarrow}
                          avatarUrl={user.account.avatar_url}
                          logoUrl={
                            challengeLogoUrls[user.account.enrollment.team]
                          }
                          weekly={weekly}
                        />
                      )
                  )
                )}
              </div>
            )}
            <div>
              <p className="weekly-title">{this.label} challenge</p>
              {this.label === 'Future'
                ? weekly && (
                    <WeeklyChallengeBoard
                      isDisabled
                      title={WEEKS[this.currentWeek + 2]}
                      week={this.currentWeek + 2}
                      isNarrow={isNarrow}
                      avatarUrl={user.account.avatar_url}
                      logoUrl={challengeLogoUrls[user.account.enrollment.team]}
                      weekly={weekly}
                    />
                  )
                : this.pastWeek.map(
                    (value, index) =>
                      weekly && (
                        <WeeklyChallengeBoard
                          isDisabled
                          title={WEEKS[value]}
                          week={value}
                          key={index}
                          isNarrow={isNarrow}
                          avatarUrl={user.account.avatar_url}
                          logoUrl={
                            challengeLogoUrls[user.account.enrollment.team]
                          }
                          weekly={weekly}
                        />
                      )
                  )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect<PropsFromState>(
  ({ api, user, notifications }: StateTree) => ({
    api,
    user,
    notifications,
  }),
  null,
  null,
  { forwardRef: true }
)(WeeklyChallengeCard);
