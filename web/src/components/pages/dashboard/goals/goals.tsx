import * as React from 'react';
import { isProduction } from '../../../../utility';
import Props from '../props';
import CustomGoal from './custom-goal';
import GoalRow from './goal-row';

import './goals.css';

const GoalsPage = ({ allGoals, saveCustomGoal }: Props) => (
  <div className="goals-inner">
    <div className="goal-rows">
      {allGoals &&
        Object.entries(allGoals.globalGoals).map((goalInfo, i) => (
          <GoalRow key={i} goalInfo={goalInfo} />
        ))}
    </div>
    {allGoals && !isProduction() && (
      <CustomGoal
        customGoal={allGoals.customGoal}
        saveCustomGoal={saveCustomGoal}
      />
    )}
  </div>
);

export default GoalsPage;
