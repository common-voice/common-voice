import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import { CustomGoalParams } from 'common/goals';
import { UserClient } from 'common/user-clients';
import URLS from '../../../urls';
import API from '../../../services/api';
import StateTree from '../../../stores/tree';
import { ALL_LOCALES } from '../../language-select/language-select';
import {
  localeConnector,
  LocaleNavLink,
  LocalePropsFromState,
} from '../../locale-helpers';
import Stats from './stats/stats';
import GoalsPage from './goals/goals';

import './dashboard.css';

interface PropsFromState {
  account: UserClient;
  api: API;
}

interface Props extends LocalePropsFromState, PropsFromState {
  children?: React.ReactNode;
}

const TITLE_BAR_LOCALE_COUNT = 3;

const TopBar = ({ account, api, children, toLocaleRoute }: Props) => {
  const [allGoals, setAllGoals] = useState(null);
  const [locale, setLocale] = useState(ALL_LOCALES);
  const [showTitleBarLocales, setShowTitleBarLocales] = useState(true);

  async function saveCustomGoal(data: CustomGoalParams) {
    setAllGoals(await api.createGoal(data));
  }

  useEffect(() => {
    if (!account) {
      sessionStorage.setItem('redirectURL', location.pathname);
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    api.fetchGoals(locale == ALL_LOCALES ? null : locale).then(setAllGoals);
  }, [locale]);

  useEffect(() => {
    const checkSize = () => {
      setShowTitleBarLocales(window.innerWidth > 992);
    };
    window.addEventListener('resize', checkSize);

    return () => {
      window.removeEventListener('resize', checkSize);
    };
  }, []);

  const locales = [ALL_LOCALES].concat(
    (account ? account.locales : []).map(({ locale }) => locale)
  );
  const titleBarLocales = showTitleBarLocales
    ? locales.slice(0, TITLE_BAR_LOCALE_COUNT)
    : [];
  const dropdownLocales = showTitleBarLocales
    ? locales.slice(TITLE_BAR_LOCALE_COUNT)
    : locales;

  return (
    <div className="dashboard">
      <div className="inner">
        <div className="top-bar">
          <nav>
            {[['stats', URLS.STATS], ['goals', URLS.GOALS]].map(
              ([label, url]) => (
                <LocaleNavLink key={url} to={url}>
                  <Localized id={label}>
                    <h2 />
                  </Localized>
                </LocaleNavLink>
              )
            )}
          </nav>

          <div className="languages">
            <span>
              <Localized id="your-languages">
                <span />
              </Localized>
              :
            </span>
            {titleBarLocales.map(l => (
              <label key={l}>
                <input
                  type="radio"
                  name="language"
                  checked={l == locale}
                  onChange={() => setLocale(l)}
                />
                <Localized id={l}>
                  <span />
                </Localized>
              </label>
            ))}
            {dropdownLocales.length > 0 && (
              <select
                className={dropdownLocales.includes(locale) ? 'selected' : ''}
                name="language"
                value={locale}
                onChange={({ target: { value } }) => {
                  if (value) {
                    setLocale(value);
                  }
                }}>
                {titleBarLocales.length > 0 && <option value="" />}
                {dropdownLocales.map(l => (
                  <Localized key={l} id={l}>
                    <option value={l} />
                  </Localized>
                ))}
              </select>
            )}
          </div>
        </div>
        <Switch>
          {[
            { route: URLS.STATS, Component: Stats },
            { route: URLS.GOALS, Component: GoalsPage },
          ].map(({ route, Component }) => (
            <Route
              key={route}
              exact
              path={toLocaleRoute(route)}
              render={props => (
                <Component
                  {...{ allGoals, locale, saveCustomGoal }}
                  {...props}
                />
              )}
            />
          ))}
        </Switch>
      </div>
    </div>
  );
};

export default connect<PropsFromState>(({ api, user }: StateTree) => ({
  api,
  account: user.account,
}))(localeConnector(TopBar));
