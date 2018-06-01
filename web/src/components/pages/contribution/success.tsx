import { LocalizationProps, Localized, withLocalization } from 'fluent-react';
import * as React from 'react';
import { connect } from 'react-redux';
import API from '../../../services/api';
import StateTree from '../../../stores/tree';
import { User } from '../../../stores/user';
import URLS from '../../../urls';
import { CheckIcon } from '../../ui/icons';
import { Button, LinkButton, TextButton } from '../../ui/ui';
import { SET_COUNT } from './contribution';

import './success.css';
import { LocaleLink } from '../../locale-helpers';

const COUNT_UP_MS = 500; // should be kept in sync with .contribution-success .done transition duration
const DAILY_GOAL = Object.freeze({ speak: 600, listen: 1200 });

const GoalPercentage = ({ percentage }: { percentage: number }) => (
  <span className="goal-percentage">{percentage}%</span>
);

interface PropsFromState {
  api: API;
  hasEnteredInfo: boolean;
}

interface Props extends LocalizationProps, PropsFromState {
  type: 'speak' | 'listen';
  onReset: () => any;
}

interface State {
  contributionCount: number;
  currentCount: number;
}

class Success extends React.Component<Props, State> {
  state: State = { contributionCount: null, currentCount: null };

  async componentDidMount() {
    const { api, type } = this.props;
    this.setState(
      {
        contributionCount:
          (await (type === 'speak'
            ? api.fetchDailyClipsCount()
            : api.fetchDailyVotesCount())) + SET_COUNT,
      },
      () => this.countUp(performance.now())
    );
  }

  private startedAt: number;
  private countUp = (time: number) => {
    if (!this.startedAt) this.startedAt = time;
    const newCount = Math.ceil(
      this.state.contributionCount * (time - this.startedAt) / COUNT_UP_MS
    );
    this.setState({
      currentCount: newCount,
    });
    if (newCount < this.state.contributionCount) {
      requestAnimationFrame(this.countUp);
    }
  };

  render() {
    const { getString, hasEnteredInfo, onReset, type } = this.props;
    const { contributionCount, currentCount } = this.state;
    return (
      <div className="contribution-success">
        <div className="counter done">
          <CheckIcon />
          {SET_COUNT}/{SET_COUNT}
          <Localized id="clips">
            <span className="text" />
          </Localized>
        </div>

        <Localized
          id="goal-help"
          goalPercentage={
            <GoalPercentage
              percentage={Math.ceil(
                100 *
                  (currentCount === null ? 0 : currentCount) /
                  DAILY_GOAL[type]
              )}
            />
          }
          $goalType={getString(type === 'speak' ? 'recording' : 'validation')}>
          <h1 />
        </Localized>

        <div className="progress">
          <div
            className="done"
            style={{
              width:
                Math.min(
                  Math.ceil(100 * (contributionCount || 0) / DAILY_GOAL[type]),
                  100
                ) + '%',
            }}
          />
        </div>

        {!hasEnteredInfo && (
          <div className="profile-card">
            <Localized id="why-profile-text">
              <p />
            </Localized>
            <Localized id="profile-create">
              <LinkButton rounded to={URLS.PROFILE} />
            </Localized>
          </div>
        )}

        <Localized id="contribute-more" $count={SET_COUNT}>
          {hasEnteredInfo ? (
            <Button rounded onClick={onReset} />
          ) : (
            <TextButton className="secondary" onClick={onReset} />
          )}
        </Localized>

        {hasEnteredInfo && (
          <Localized id="edit-profile">
            <LocaleLink className="secondary" to={URLS.PROFILE} />
          </Localized>
        )}
      </div>
    );
  }
}

export default withLocalization(
  connect<PropsFromState>(({ api, user }: StateTree) => ({
    api,
    hasEnteredInfo: User.selectors.hasEnteredInfo(user),
  }))(Success)
);
