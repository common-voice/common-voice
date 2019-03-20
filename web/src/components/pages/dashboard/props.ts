import { AllGoals, CustomGoalParams } from 'common/goals';

export default interface Props {
  allGoals?: AllGoals;
  saveCustomGoal: (data: CustomGoalParams) => any;
  locale: string;
}
