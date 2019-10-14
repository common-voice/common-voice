import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { useAccount, useAPI } from '../../../hooks/store-hooks';
import { useRouter } from '../../../hooks/use-router';
import URLS from '../../../urls';
import { ALL_LOCALES } from '../../language-select/language-select';
import {
  isContributable,
  LocaleNavLink,
  useLocale,
} from '../../locale-helpers';
import StatsPage from './stats/stats';
import GoalsPage from './goals/goals';
import AwardsPage from './awards/awards';

import './dashboard.css';
import { NATIVE_NAMES } from '../../../services/localization';

const TITLE_BAR_LOCALE_COUNT = 3;

const TopBar = ({ dashboardLocale }: { dashboardLocale: string }) => {
  const { history, location } = useRouter();
  const [, toLocaleRoute] = useLocale();
  const account = useAccount();
  const [showTitleBarLocales, setShowTitleBarLocales] = useState(true);

  function setLocale(value: string) {
    const pathParts = location.pathname.split('/');
    history.push(
      [toLocaleRoute(URLS.DASHBOARD), value, pathParts[pathParts.length - 1]]
        .filter(Boolean)
        .join('/')
    );
  }

  const unseenAwards = account
    ? account.awards.filter(a => !a.seen_at).length
    : 0;

  const locales = [''].concat(
    (account ? account.locales : [])
      .map(({ locale }) => locale)
      .filter(l => isContributable(l))
  );
  const titleBarLocales = showTitleBarLocales
    ? locales.slice(0, TITLE_BAR_LOCALE_COUNT)
    : [];
  const dropdownLocales = showTitleBarLocales
    ? locales.slice(TITLE_BAR_LOCALE_COUNT)
    : locales;

  useEffect(() => {
    const checkSize = () => {
      setShowTitleBarLocales(window.innerWidth > 992);
    };
    window.addEventListener('resize', checkSize);

    return () => {
      window.removeEventListener('resize', checkSize);
    };
  }, []);

  return (
    <div className="top-bar">
      <nav>
        <LocaleNavLink
          key={URLS.CHALLENGE}
          to={
            URLS.DASHBOARD +
            (dashboardLocale ? '/' + dashboardLocale : '') +
            URLS.CHALLENGE
          }>
          <h2>Challenge</h2>
        </LocaleNavLink>
        {[['stats', URLS.STATS], ['goals', URLS.GOALS]].map(([label, path]) => (
          <LocaleNavLink
            key={path}
            to={
              URLS.DASHBOARD +
              (dashboardLocale ? '/' + dashboardLocale : '') +
              path
            }>
            <Localized id={label}>
              <h2 />
            </Localized>
          </LocaleNavLink>
        ))}
        <LocaleNavLink
          to={
            URLS.DASHBOARD +
            (dashboardLocale ? '/' + dashboardLocale : '') +
            URLS.AWARDS
          }>
          <h2>
            <Localized id="awards">
              <span />
            </Localized>{' '}
            {unseenAwards > 0 && (
              <span className="badge">
                {unseenAwards > 9 ? '9+' : unseenAwards}
              </span>
            )}
          </h2>
        </LocaleNavLink>
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
              checked={l == dashboardLocale}
              onChange={() => setLocale(l)}
            />
            {l ? (
              <span>{NATIVE_NAMES[l]}</span>
            ) : (
              <Localized id={ALL_LOCALES}>
                <span />
              </Localized>
            )}
          </label>
        ))}
        {dropdownLocales.length > 0 && (
          <select
            className={
              dropdownLocales.includes(dashboardLocale) ? 'selected' : ''
            }
            name="language"
            value={dashboardLocale}
            onChange={({ target: { value } }) => {
              if (value) {
                setLocale(value);
              }
            }}>
            {titleBarLocales.length > 0 && <option value="" />}
            {dropdownLocales.map(l =>
              l ? (
                <option key={l} value={l}>
                  {NATIVE_NAMES[l]}
                </option>
              ) : (
                <Localized key={ALL_LOCALES} id={l}>
                  <option value={l} />
                </Localized>
              )
            )}
          </select>
        )}
      </div>
    </div>
  );
};

function DashboardContent({
  Page,
  dashboardLocale,
}: {
  Page: typeof StatsPage | typeof GoalsPage | typeof AwardsPage;
  dashboardLocale: string;
}) {
  const api = useAPI();
  const [allGoals, setAllGoals] = useState(null);

  useEffect(() => {
    api.fetchGoals(dashboardLocale || null).then(setAllGoals);
  }, [dashboardLocale]);

  return <Page {...{ allGoals, dashboardLocale }} />;
}

const PAGES = [
  { subPath: URLS.STATS, Page: StatsPage },
  { subPath: URLS.GOALS, Page: GoalsPage },
  { subPath: URLS.AWARDS, Page: AwardsPage },
  { subPath: URLS.CHALLENGE, Page: AwardsPage },
];

export default function Dashboard() {
  const { match } = useRouter();
  const account = useAccount();
  const [, toLocaleRoute] = useLocale();

  useEffect(() => {
    if (!account) {
      sessionStorage.setItem('redirectURL', location.pathname);
      window.location.href = '/login';
    }
  }, []);

  return (
    <div className="dashboard">
      <div className="inner">
        <Switch>
          {PAGES.map(({ subPath, Page }) => (
            <Route
              key={subPath}
              exact
              path={match.path + subPath}
              render={() => (
                <>
                  <TopBar dashboardLocale="" />
                  <DashboardContent dashboardLocale="" {...{ Page }} />
                </>
              )}
            />
          ))}
          <Route
            path={match.path + '/:dashboardLocale'}
            render={({
              match: {
                params: { dashboardLocale },
              },
            }) => (
              <>
                <TopBar {...{ dashboardLocale }} />
                <Switch>
                  {PAGES.map(({ subPath, Page }) => (
                    <Route
                      key={subPath}
                      exact
                      path={match.path + '/' + dashboardLocale + subPath}
                      render={() => (
                        <DashboardContent {...{ dashboardLocale, Page }} />
                      )}
                    />
                  ))}
                  <Route
                    render={() => (
                      <Redirect
                        to={toLocaleRoute(
                          URLS.DASHBOARD + '/' + dashboardLocale + URLS.STATS
                        )}
                      />
                    )}
                  />
                </Switch>
              </>
            )}
          />
          <Route
            render={() => (
              <Redirect to={toLocaleRoute(URLS.DASHBOARD + URLS.STATS)} />
            )}
          />
        </Switch>
      </div>
    </div>
  );
}
