import { Localized } from '@fluent/react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import * as Sentry from '@sentry/react';

import { useAccount, useAPI, useAction } from '../../../hooks/store-hooks';
import { useRouter } from '../../../hooks/use-router';
import URLS from '../../../urls';
import { ALL_LOCALES } from '../../language-select/language-select';
import {
  isContributable,
  LocaleNavLink,
  useLocale,
  useNativeLocaleNames,
} from '../../locale-helpers';
import { Notifications } from '../../../stores/notifications';
import StatsPage from './stats/stats';
import GoalsPage from './goals/goals';
import AwardsPage from './awards/awards';
import ChallengePage from './challenge/challenge';
import { Button } from '../../ui/ui';
import InviteModal from '../../invite-modal/invite-modal';
import { isChallengeLive, pilotDates, isEnrolled } from './challenge/constants';

import './dashboard.css';

const SentryRoute = Sentry.withSentryRouting(Route);

const TITLE_BAR_LOCALE_COUNT = 3;

const TopBar = ({
  dashboardLocale,
  setShowInviteModal,
}: {
  dashboardLocale: string;
  setShowInviteModal(arg: any): void;
}) => {
  const nativeNames = useNativeLocaleNames();
  const { history, location } = useRouter();
  const [, toLocaleRoute] = useLocale();
  const account = useAccount();
  const [isAboveMdWidth, setIsAboveMdWidth] = useState(true);
  const isChallengeEnrolled = isEnrolled(account);
  const isChallengeTabSelected =
    location.pathname.endsWith('/challenge') && isChallengeEnrolled;

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
    (account ? account.languages : [])
      .map(({ locale }) => locale)
      .filter(l => isContributable(l))
  );
  const titleBarLocales = isAboveMdWidth
    ? locales.slice(0, TITLE_BAR_LOCALE_COUNT)
    : [];
  const dropdownLocales = isAboveMdWidth
    ? locales.slice(TITLE_BAR_LOCALE_COUNT)
    : locales;

  useEffect(() => {
    const checkSize = () => {
      const { innerWidth } = window;
      setIsAboveMdWidth(innerWidth >= 768);
    };
    checkSize();
    window.addEventListener('resize', checkSize);

    return () => {
      window.removeEventListener('resize', checkSize);
    };
  }, [isChallengeTabSelected]);

  return (
    <div className={`top-bar${isChallengeEnrolled ? ' with-challenge' : ''}`}>
      <div className="underlined">
        <nav>
          {isChallengeEnrolled && (
            <LocaleNavLink
              key={URLS.CHALLENGE}
              to={
                URLS.DASHBOARD +
                (dashboardLocale ? '/' + dashboardLocale : '') +
                URLS.CHALLENGE
              }>
              <h2>Challenge</h2>
            </LocaleNavLink>
          )}
          {[
            ['stats', URLS.STATS],
            ['goals', URLS.GOALS],
          ].map(([label, path]) => (
            <LocaleNavLink
              key={path}
              to={
                URLS.DASHBOARD +
                (dashboardLocale ? '/' + dashboardLocale : '') +
                path
              }>
              <Localized id={label}>
                {/* Localized injects content into child tag */}
                {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
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
            <h2 hidden>
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
        {isChallengeTabSelected ? (
          <div hidden className="language challenge-language">
            <span>Language:</span>
            <span className="language-text">English</span>
          </div>
        ) : (
          <div hidden className="languages">
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
                  <span>{nativeNames[l]}</span>
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
                      {nativeNames[l]}
                    </option>
                  ) : (
                    <Localized key={ALL_LOCALES} id={l ? l : ALL_LOCALES}>
                      <option value={l ? l : ALL_LOCALES} />
                    </Localized>
                  )
                )}
              </select>
            )}
          </div>
        )}
      </div>
      {isChallengeTabSelected && (
        <ChallengeBar setShowInviteModal={setShowInviteModal} />
      )}
    </div>
  );
};

function DashboardContent({
  Page,
  dashboardLocale,
}: {
  Page:
    | typeof ChallengePage
    | typeof StatsPage
    | typeof GoalsPage
    | typeof AwardsPage;
  dashboardLocale: string;
}) {
  const api = useAPI();
  const [allGoals, setAllGoals] = useState(null);

  useEffect(() => {
    api.fetchGoals(dashboardLocale || null).then(setAllGoals);
  }, [dashboardLocale]);

  return <Page {...{ allGoals, dashboardLocale }} />;
}

interface ChallengeBarProps {
  setShowInviteModal(arg: any): void;
}
const ChallengeBar = ({ setShowInviteModal }: ChallengeBarProps) => {
  const api = useAPI();
  const [points, setAllPoints] = useState({ user: 0, team: 0 });

  useEffect(() => {
    api.fetchChallengePoints().then(value => value && setAllPoints(value));
    // TODO: investigate how this interacts with asynchronous user loading
  }, []);
  return (
    <div className="challenge-bar">
      {isChallengeLive(pilotDates) && (
        <div className="points">
          <img src={require('./awards/star.svg')} alt="score" />
          <span className="score">{points.user}</span>
          <span className="label label-my">My points</span>
        </div>
      )}

      <Button
        rounded
        className="invite-btn"
        onClick={() => setShowInviteModal(true)}>
        <span className="content">Invite</span>
        <span className="plus-icon"></span>
      </Button>
    </div>
  );
};

export default function Dashboard() {
  const { match } = useRouter();
  const account = useAccount();
  const api = useAPI();
  const [, toLocaleRoute] = useLocale();
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const addAchievement = useAction(Notifications.actions.addAchievement);
  const isChallengeEnrolled = isEnrolled(account);
  const pages = [
    { subPath: URLS.STATS, Page: StatsPage },
    { subPath: URLS.GOALS, Page: GoalsPage },
    { subPath: URLS.AWARDS, Page: AwardsPage },
  ];
  let defaultPage = URLS.STATS;
  if (isChallengeEnrolled) {
    // @ts-ignore
    pages.unshift({ subPath: URLS.CHALLENGE, Page: ChallengePage });
    if (isChallengeLive(pilotDates)) {
      defaultPage = URLS.CHALLENGE;
    }
  }

  useEffect(() => {
    if (!account) {
      try {
        sessionStorage.setItem('redirectURL', '/voicewall' + location.pathname);
      } catch (e) {
        console.warn(`A sessionStorage error occurred ${e.message}`);
      }

      window.location.href = '/voicewall/login';
    }
  }, []);

  return (
    <div
      className={
        'dashboard' + isChallengeEnrolled
          ? ' ' + isChallengeLive(pilotDates)
            ? 'challenge-online'
            : 'challenge-offline'
          : ''
      }>
      {showInviteModal && (
        <InviteModal
          enrollment={account.enrollment}
          onRequestClose={() => {
            setShowInviteModal(false);
            if (JSON.parse(sessionStorage.getItem('showInviteSendToast'))) {
              addAchievement(50, 'You sent your first invite!');
              sessionStorage.removeItem('showInviteSendToast');
            }
            if (
              !JSON.parse(sessionStorage.getItem('challengeEnded')) &&
              !JSON.parse(sessionStorage.getItem('hasEarnedSessionToast')) &&
              JSON.parse(sessionStorage.getItem('hasContributed'))
            ) {
              addAchievement(
                50,
                "You're on a roll! You sent an invite and contributed in the same session."
              );
              sessionStorage.removeItem('hasEarnedSessionToast');
              sessionStorage.removeItem('hasContributed');
              // Tell back-end user get unexpected achievement: invite + contribute in the same session
              // Each user can only get once.
              api.setInviteContributeAchievement();
            }
          }}
        />
      )}
      <div className="inner">
        <Switch>
          {pages.map(({ subPath, Page }) => (
            <SentryRoute
              key={subPath}
              exact
              path={match.path + subPath}
              render={() => (
                <>
                  <TopBar
                    dashboardLocale=""
                    setShowInviteModal={setShowInviteModal}
                  />
                  <DashboardContent dashboardLocale="" {...{ Page }} />
                </>
              )}
            />
          ))}
          <SentryRoute
            path={match.path + '/:dashboardLocale'}
            render={({
              match: {
                params: { dashboardLocale },
              },
            }) => (
              <>
                <TopBar
                  {...{ dashboardLocale }}
                  setShowInviteModal={setShowInviteModal}
                />
                <Switch>
                  {pages.map(({ subPath, Page }) => (
                    <SentryRoute
                      key={subPath}
                      exact
                      path={match.path + '/' + dashboardLocale + subPath}
                      render={() => (
                        <DashboardContent {...{ dashboardLocale, Page }} />
                      )}
                    />
                  ))}
                  <SentryRoute
                    render={() => (
                      <Redirect
                        to={toLocaleRoute(URLS.DASHBOARD + defaultPage)}
                      />
                    )}
                  />
                </Switch>
              </>
            )}
          />
          <SentryRoute
            render={() => (
              <Redirect to={toLocaleRoute(URLS.DASHBOARD + defaultPage)} />
            )}
          />
        </Switch>
      </div>
    </div>
  );
}
