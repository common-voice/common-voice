import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { connect } from 'react-redux';
import { DAILY_GOAL } from '../../../constants';
import API from '../../../services/api';
import StateTree from '../../../stores/tree';
import { User } from '../../../stores/user';
import URLS from '../../../urls';
import { LocaleLink } from '../../locale-helpers';
import { CheckIcon, MicIcon, PlayOutlineIcon } from '../../ui/icons';
import { Button, LinkButton, TextButton } from '../../ui/ui';
import { SET_COUNT } from './contribution';

import './success.css';

const COUNT_UP_MS = 500; // should be kept in sync with .contribution-success .done transition duration

const GoalPercentage = ({
  current,
  final,
}: {
  current: number;
  final: number;
}) => (
  <span className="goal-percentage">
    <span className="final">{final}%</span>
    <span className="current">{current}%</span>
  </span>
);

interface PropsFromState {
  api: API;
  user: User.State;
}

interface Props extends PropsFromState {
  type: 'speak' | 'listen';
  onReset: () => any;
}

interface State {
  contributionCount: number;
  currentCount: number;
}

class Success extends React.Component<Props, State> {
  state: State = { contributionCount: null, currentCount: null };

  killAnimation = false;

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

  componentWillUnmount() {
    this.killAnimation = true;
  }

  private startedAt: number;
  private countUp = (time: number) => {
    if (this.killAnimation) return;
    if (!this.startedAt) this.startedAt = time;
    const { contributionCount } = this.state;
    const newCount = Math.min(
      Math.ceil((contributionCount * (time - this.startedAt)) / COUNT_UP_MS),
      contributionCount
    );
    this.setState({
      currentCount: newCount,
    });
    if (newCount < contributionCount) {
      requestAnimationFrame(this.countUp);
    }
  };

  render() {
    const { onReset, type, user } = this.props;
    const { contributionCount, currentCount } = this.state;
    const finalPercentage = Math.ceil(
      (100 * (contributionCount || 0)) / DAILY_GOAL[type]
    );

    const hasAccount = user.account;

    const ContributeMoreButton = (props: { children: React.ReactNode }) =>
      hasAccount ? (
        <Button
          className="contribute-more-button"
          rounded
          onClick={onReset}
          {...props}
        />
      ) : (
        <TextButton
          className="contribute-more-button secondary"
          onClick={onReset}
          {...props}
        />
      );

    return (
      <div className="contribution-success">
        <div className="counter done">
          <CheckIcon />
          <Localized
            id="clips-with-count"
            bold={<b />}
            $count={SET_COUNT + '/' + SET_COUNT}>
            <span className="text" />
          </Localized>
        </div>

        <Localized
          id={type === 'speak' ? 'goal-help-recording' : 'goal-help-validation'}
          goalPercentage={
            <GoalPercentage
              current={Math.ceil(
                (100 * (currentCount === null ? 0 : currentCount)) /
                  DAILY_GOAL[type]
              )}
              final={finalPercentage}
            />
          }
          $goalValue={DAILY_GOAL[type]}>
          <h1 />
        </Localized>

        <div className="progress">
          <div
            className="done"
            style={{
              width: Math.min(finalPercentage, 100) + '%',
            }}
          />
        </div>

        {!hasAccount && (
          <div className="profile-card">
            <Localized id="profile-explanation">
              <p />
            </Localized>
            <Localized id="login-signup">
              <LinkButton rounded href="/login" />
            </Localized>
          </div>
        )}

        <ContributeMoreButton>
          {type === 'speak' ? <MicIcon /> : <PlayOutlineIcon />}
          <Localized id="contribute-more" $count={SET_COUNT}>
            <span />
          </Localized>
        </ContributeMoreButton>

        {hasAccount && (
          <Localized id="edit-profile">
            <LocaleLink className="secondary" to={URLS.PROFILE_INFO} />
          </Localized>
        )}
      </div>
    );
  }
}

export default connect<PropsFromState>(({ api, user }: StateTree) => ({
  api,
  user,
}))(Success);
