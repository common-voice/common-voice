import * as React from 'react';
import CustomGoalLock from '../../../custom-goal-lock';
import Props from '../props';
import CustomGoal from './custom-goal';
import GoalRow from './goal-row';

import './goals.css';

const GoalsPage = ({ allGoals, locale }: Props) => (
  <div className="goals-inner">
    <div className="goal-rows">
      {allGoals &&
        Object.entries(allGoals.globalGoals).map((goalInfo, i) => (
          <GoalRow key={i} goalInfo={goalInfo} />
        ))}
    </div>
    {allGoals && (
      <CustomGoalLock currentLocale={locale}>
        <CustomGoal />
      </CustomGoalLock>
    )}
  </div>
);

export default GoalsPage;
