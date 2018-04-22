import * as React from 'react';
import { connect } from 'react-redux';
import { Link, LinkProps, NavLink, NavLinkProps } from 'react-router-dom';
import StateTree from '../stores/tree';

export interface LocalePropsFromState {
  toLocaleRoute: (path: any) => string;
}

interface LocaleProps extends LocalePropsFromState {
  dispatch: any;
}

const toLocaleRouteBuilder = (locale: string) => (path: string) =>
  `/${locale}${path}`;

export const localeConnector = connect<LocalePropsFromState>(
  ({ locale }: StateTree) => ({
    toLocaleRoute: toLocaleRouteBuilder(locale),
  }),
  null,
  null,
  { pure: false }
);

export const LocaleLink = localeConnector(
  ({ dispatch, to, toLocaleRoute, ...props }: LinkProps & LocaleProps) => (
    <Link to={toLocaleRoute(to)} {...props} />
  )
);

export const LocaleNavLink = localeConnector(
  ({ dispatch, to, toLocaleRoute, ...props }: NavLinkProps & LocaleProps) => (
    <NavLink to={toLocaleRoute(to)} {...props} />
  )
);
