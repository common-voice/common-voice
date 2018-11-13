import * as React from 'react';
import { MicIcon, OldPlayIcon } from '../../ui/icons';
import { Button } from '../../ui/ui';

import './progress-box.css';

export default ({ type }: { type: 'clips' | 'votes' }) => {
  const personalCurrent = 5;
  const personalGoal = 20;
  const overallCurrent = 86;
  const overallGoal = 600;
  const isRecord = type == 'clips';
  return (
    <div className={'progress-box ' + type}>
      <div className="personal">
        <div className="numbers">
          <div className="current">{personalCurrent}</div>
          <div className="total">
            {' / '}
            {personalGoal}
          </div>
        </div>
        <div className="description">
          Clips you've {isRecord ? 'recorded' : 'validated'}
        </div>
        <div />
      </div>

      <div className="progress-wrap">
        <div className="progress">
          <div className="icon-wrap">
            {isRecord ? (
              <MicIcon />
            ) : (
              <OldPlayIcon style={{ position: 'relative', left: 3 }} />
            )}
          </div>
          <div className="bar">
            <div
              className="current"
              style={{
                width:
                  Math.min((100 * personalCurrent) / personalGoal, 100) + '%',
              }}
            />
          </div>
        </div>
      </div>

      <div className="overall">
        <div className="numbers">
          <div className="current">{overallCurrent}</div>
          <div className="total">
            {' / '}
            {overallGoal}
          </div>
        </div>
        <div className="description">
          Today's Common Voice progress on clips{' '}
          {isRecord ? 'recorded' : 'validated'}
        </div>
        <Button rounded outline>
          Help us get to {overallGoal}
        </Button>
      </div>
    </div>
  );
};
