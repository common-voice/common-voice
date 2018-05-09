import * as React from 'react';
import { connect } from 'react-redux';
import { Link, LinkProps, NavLink, NavLinkProps } from 'react-router-dom';
const contributableLocales = require('../../../locales/contributable.json');
import { Locale } from '../stores/locale';
import StateTree from '../stores/tree';
import { isProduction } from '../utility';

export interface LocalePropsFromState {
  locale: Locale.State;
  toLocaleRoute: (path: any) => string;
}

interface LocaleProps extends LocalePropsFromState {
  dispatch: any;
}

const toLocaleRouteBuilder = (locale: string) => (path: string) =>
  `/${locale}${path}`;

export const localeConnector = connect<LocalePropsFromState>(
  ({ locale }: StateTree) => ({
    locale,
    toLocaleRoute: toLocaleRouteBuilder(locale),
  }),
  null,
  null,
  { pure: false }
);

export const LocaleLink = localeConnector(
  ({
    dispatch,
    locale,
    to,
    toLocaleRoute,
    ...props
  }: LinkProps & LocaleProps) => <Link to={toLocaleRoute(to)} {...props} />
);

export const LocaleNavLink = localeConnector(
  ({
    dispatch,
    locale,
    to,
    toLocaleRoute,
    ...props
  }: NavLinkProps & LocaleProps) => (
    <NavLink to={toLocaleRoute(to)} {...props} />
  )
);

// TODO: remove production guard
export function isContributable(locale: string) {
  return (isProduction() ? ['en'] : contributableLocales).includes(locale);
}

export const ContributableLocaleLock = localeConnector(
  ({
    children,
    locale,
    render,
  }: LocaleProps & {
    children?: any;
    render?: (args: { isContributable: boolean }) => React.ReactNode;
  }) => {
    return render
      ? render({ isContributable: isContributable(locale) })
      : isContributable(locale) && children;
  }
);
