import * as React from 'react';
import Props from '../props';
import CustomGoal from './custom-goal';
import GoalRow from './goal-row';
import { useAccount, useAction } from '../../../../hooks/store-hooks';
import { Notifications } from '../../../../stores/notifications';

import './goals.css';

const GoalsPage = ({ allGoals, dashboardLocale }: Props) => {
  const account = useAccount();
  const addNotification = useAction(Notifications.actions.addPill);
  allGoals.globalGoals.streaks;
  if (
    account.custom_goals.length > 0 &&
    allGoals.globalGoals.streaks[0] === 3
  ) {
    addNotification(
      <div className="achievement">
        <img src={require('../challenge/images/star.svg')} alt="" />
        <p className="score">+ 50 points</p>
        <p>You completed a three-day streak! Keep it up.</p>
      </div>
    );
  }
  return (
    <div className="goals-inner">
      <div className="goal-rows">
        {allGoals &&
          Object.entries(allGoals.globalGoals).map((goalInfo, i) => (
            <GoalRow key={i} goalInfo={goalInfo} />
          ))}
      </div>
      <CustomGoal key={dashboardLocale} {...{ dashboardLocale }} />
    </div>
  );
};

export default GoalsPage;
