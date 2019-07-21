import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from 'react-router';
import { useAccount, useAPI } from '../../../hooks/store-hooks';
import URLS from '../../../urls';
import CustomGoalLock from '../../custom-goal-lock';
import { ALL_LOCALES } from '../../language-select/language-select';
import { LocaleNavLink, useLocale } from '../../locale-helpers';
import StatsPage from './stats/stats';
import GoalsPage from './goals/goals';
import AwardsPage from './awards/awards';

import './dashboard.css';

const TITLE_BAR_LOCALE_COUNT = 3;

const TopBar = ({ history }: RouteComponentProps) => {
  const account = useAccount();
  const api = useAPI();
  const [, toLocaleRoute] = useLocale();

  const [allGoals, setAllGoals] = useState(null);
  const [locale, setLocale] = useState(ALL_LOCALES);
  const [showTitleBarLocales, setShowTitleBarLocales] = useState(true);

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

  const unseenAwards = account
    ? account.awards.filter(a => !a.seen_at).length
    : 0;

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
            <CustomGoalLock currentLocale={locale}>
              <LocaleNavLink to={URLS.AWARDS}>
                <h2>
                  Awards{' '}
                  {unseenAwards > 0 && (
                    <span className="badge">
                      {unseenAwards > 9 ? '9+' : unseenAwards}
                    </span>
                  )}
                </h2>
              </LocaleNavLink>
            </CustomGoalLock>
          </nav>

          {!history.location.pathname.includes(URLS.AWARDS) && (
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
          )}
        </div>
        <Switch>
          {[
            { route: URLS.STATS, Component: StatsPage },
            { route: URLS.GOALS, Component: GoalsPage },
          ].map(({ route, Component }) => (
            <Route
              key={route}
              exact
              path={toLocaleRoute(route)}
              render={props => (
                <Component {...{ allGoals, locale }} {...props} />
              )}
            />
          ))}
          <CustomGoalLock
            currentLocale={locale}
            render={({ hasCustomGoal }) =>
              hasCustomGoal ? (
                <Route
                  exact
                  path={toLocaleRoute(URLS.AWARDS)}
                  component={AwardsPage}
                />
              ) : (
                <Redirect to={toLocaleRoute(URLS.GOALS)} />
              )
            }
          />
        </Switch>
      </div>
    </div>
  );
};

export default withRouter(TopBar);
