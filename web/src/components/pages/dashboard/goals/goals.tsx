import * as React from 'react';
import { ALL_LOCALES } from '../../../language-select/language-select';
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
    {allGoals && locale !== ALL_LOCALES && (
      <CustomGoal key={locale} {...{ locale }} />
    )}
  </div>
);

export default GoalsPage;
