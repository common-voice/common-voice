import { LocalizationProps, Localized, withLocalization } from 'fluent-react';
import * as React from 'react';
import { connect } from 'react-redux';
import StateTree from '../../../stores/tree';
import { User } from '../../../stores/user';
import URLS from '../../../urls';
import { CheckIcon } from '../../ui/icons';
import { Button, LinkButton } from '../../ui/ui';
import { SET_COUNT } from './contribution';

import './success.css';

const GoalPercentage = ({ count }: { count: number }) => (
  <span className="goal-percentage">{count}%</span>
);

interface PropsFromState {
  hasEnteredInfo: boolean;
}

interface Props extends LocalizationProps, PropsFromState {
  type: 'speak' | 'listen';
  onReset: () => any;
}

const Success = ({ getString, hasEnteredInfo, onReset, type }: Props) => {
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
        id="toward-goal"
        goalPercentage={<GoalPercentage count={10} />}
        $goalType={getString(type === 'speak' ? 'recording' : 'validation')}>
        <h1 />
      </Localized>

      <div className="progress">
        <div className="total" style={{ width: '40%' }} />
        <div className="done" style={{ width: '10%' }} />
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
        <Button outline={!hasEnteredInfo} rounded onClick={onReset} />
      </Localized>

      {hasEnteredInfo && (
        <Localized id="edit-profile">
          <LinkButton rounded outline to={URLS.PROFILE} />
        </Localized>
      )}
    </div>
  );
};

export default withLocalization(
  connect<PropsFromState>(({ user }: StateTree) => ({
    hasEnteredInfo: User.selectors.hasEnteredInfo(user),
  }))(Success)
);
