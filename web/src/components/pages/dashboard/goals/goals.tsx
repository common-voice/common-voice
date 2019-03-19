import * as React from 'react';
import { isProduction } from '../../../../utility';
import Props from '../props';
import CustomGoal from './custom-goal';
import GoalRow from './goal-row';

import './goals.css';

const GoalsPage = ({ allGoals }: Props) => (
  <div className="goals-inner">
    <div className="goal-rows">
      {Object.entries(allGoals || {}).map((goalInfo, i) => (
        <GoalRow key={i} goalInfo={goalInfo} />
      ))}
    </div>
    {!isProduction() && <CustomGoal />}
  </div>
);

export default GoalsPage;
