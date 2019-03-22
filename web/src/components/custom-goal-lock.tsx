import * as React from 'react';
import { connect } from 'react-redux';
import { isProduction } from '../utility';
import StateTree from '../stores/tree';
import { User } from '../stores/user';

const CUSTOM_GOAL_LOCALE = 'en';

interface PropsFromState {
  locale: string;
  user: User.State;
}

type Props = {
  children: React.ReactNode;
  currentLocale?: string;
} & PropsFromState;

class CustomGoalLock extends React.Component<Props> {
  render() {
    const { children, currentLocale, locale, user } = this.props;
    return !isProduction() &&
      user.account &&
      (user.account.locales.some(l => l.locale == CUSTOM_GOAL_LOCALE) ||
        locale == CUSTOM_GOAL_LOCALE) &&
      (!currentLocale || currentLocale == CUSTOM_GOAL_LOCALE)
      ? children
      : null;
  }
}

export default connect<PropsFromState>(({ locale, user }: StateTree) => ({
  locale,
  user,
}))(CustomGoalLock);
