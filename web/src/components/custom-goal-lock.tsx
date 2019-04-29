import * as React from 'react';
import { connect } from 'react-redux';
import StateTree from '../stores/tree';
import { User } from '../stores/user';
import { ALL_LOCALES } from './language-select/language-select';

export const CUSTOM_GOAL_LOCALE = 'en';

interface PropsFromState {
  locale: string;
  user: User.State;
}

type Props = {
  children?: React.ReactNode;
  render?: (args: { hasCustomGoal: boolean }) => React.ReactNode;
  currentLocale?: string;
} & PropsFromState;

class CustomGoalLock extends React.Component<Props> {
  render() {
    const { children, currentLocale, locale, render, user } = this.props;
    const hasCustomGoal =
      user.account &&
      (user.account.locales.some(l => l.locale == CUSTOM_GOAL_LOCALE) &&
        locale == CUSTOM_GOAL_LOCALE) &&
      (!currentLocale ||
        currentLocale == CUSTOM_GOAL_LOCALE ||
        currentLocale == ALL_LOCALES);
    return render ? render({ hasCustomGoal }) : hasCustomGoal ? children : null;
  }
}

export default connect<PropsFromState>(({ locale, user }: StateTree) => ({
  locale,
  user,
}))(CustomGoalLock);
