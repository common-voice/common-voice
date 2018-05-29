import { LocalizationProps, Localized, withLocalization } from 'fluent-react';
import * as React from 'react';
import { SET_COUNT } from './contribution';
import { CheckIcon } from '../../ui/icons';

import './success.css';

const GoalPercentage = ({ count }: { count: number }) => (
  <span className="goal-percentage">{count}%</span>
);

export default withLocalization(
  ({ getString, type }: { type: 'speak' | 'listen' } & LocalizationProps) => {
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
      </div>
    );
  }
);
