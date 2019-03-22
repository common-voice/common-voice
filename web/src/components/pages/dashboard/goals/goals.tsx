import * as React from 'react';
import CustomGoalLock from '../../../custom-goal-lock';
import { ALL_LOCALES } from '../../../language-select/language-select';
import Props from '../props';
import CustomGoal from './custom-goal';
import GoalRow from './goal-row';

import './goals.css';

const GoalsPage = ({ allGoals, locale, saveCustomGoal }: Props) => (
  <div className="goals-inner">
    <div className="goal-rows">
      {allGoals &&
        Object.entries(allGoals.globalGoals).map((goalInfo, i) => (
          <GoalRow key={i} goalInfo={goalInfo} />
        ))}
    </div>
    {allGoals && (
      <CustomGoalLock currentLocale={locale == ALL_LOCALES ? null : locale}>
        <CustomGoal
          customGoal={allGoals.customGoal}
          saveCustomGoal={saveCustomGoal}
        />
      </CustomGoalLock>
    )}
  </div>
);

export default GoalsPage;
