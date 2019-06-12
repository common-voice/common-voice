import * as React from 'react';
import { useTypedSelector } from '../stores/tree';
import { ALL_LOCALES } from './language-select/language-select';
import { useLocale } from './locale-helpers';

export const CUSTOM_GOAL_LOCALE = 'en';

export default function CustomGoalLock({
  children,
  currentLocale,
  render,
}: {
  children?: React.ReactNode;
  render?: (args: { hasCustomGoal: boolean }) => React.ReactNode;
  currentLocale?: string;
}) {
  const [locale] = useLocale();
  const user = useTypedSelector(({ user }) => user);
  const hasCustomGoal =
    user.account &&
    (user.account.locales.some(l => l.locale == CUSTOM_GOAL_LOCALE) &&
      locale == CUSTOM_GOAL_LOCALE) &&
    (!currentLocale ||
      currentLocale == CUSTOM_GOAL_LOCALE ||
      currentLocale == ALL_LOCALES);
  return (
    <>{render ? render({ hasCustomGoal }) : hasCustomGoal ? children : null}</>
  );
}
