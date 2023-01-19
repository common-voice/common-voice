import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import * as Sentry from '@sentry/react';

import URLS from '../../urls';
import { isContributable, useLocale } from '../locale-helpers';
import DocumentPage from '../pages/document-page';
import { Spinner } from '../ui/ui';
import { LoginFailure, LoginSuccess } from '../pages/login';
const HomePage = React.lazy(() => import('../pages/home/home'));
const DatasetsPage = React.lazy(() => import('../pages/datasets/datasets'));
const LanguagesPage = React.lazy(() => import('../pages/languages/languages'));
const LanguagesRequestPage = React.lazy(() => {
  return import('../pages/languages/request/request');
});
const LanguagesRequestSuccessPage = React.lazy(() => {
  return import('../pages/languages/request/request-success');
});
const DashboardPage = React.lazy(() => import('../pages/dashboard/dashboard'));
const ProfileLayoutPage = React.lazy(() => import('../pages/profile/layout'));
const AboutPage = React.lazy(() => import('../pages/about/about'));
const LandingPage = React.lazy(() => import('../pages/landing/landing'));
const ErrorPage = React.lazy(() => import('../pages/error-page/error-page'));
const CriteriaPage = React.lazy(() => import('../pages/criteria/criteria'));
const PartnerPage = React.lazy(() => import('../pages/partner/partner'));

const SentryRoute = Sentry.withSentryRouting(Route);

export default function Content({ location }: { location: any }) {
  const [locale, toLocaleRoute] = useLocale();
  return (
    <React.Suspense fallback={<Spinner />}>
      <Switch>
        <SentryRoute
          exact
          path={toLocaleRoute(URLS.ROOT)}
          component={HomePage}
        />
        <SentryRoute
          exact
          path={toLocaleRoute('/new')}
          render={() => <Redirect to={toLocaleRoute(URLS.ROOT)} />}
        />
        <SentryRoute
          exact
          path={toLocaleRoute(URLS.RECORD)}
          render={() => (
            <Redirect
              to={toLocaleRoute(
                isContributable(locale) ? URLS.SPEAK : URLS.ROOT
              )}
            />
          )}
        />
        <SentryRoute
          exact
          path={toLocaleRoute(URLS.LANGUAGES)}
          component={LanguagesPage}
        />
        <SentryRoute
          exact
          path={toLocaleRoute(URLS.LANGUAGE_REQUEST)}
          component={LanguagesRequestPage}
        />
        <SentryRoute
          exact
          path={toLocaleRoute(URLS.LANGUAGE_REQUEST_SUCCESS)}
          component={LanguagesRequestSuccessPage}
        />
        <SentryRoute
          exact
          path={toLocaleRoute(URLS.DATA)}
          render={() => <Redirect to={toLocaleRoute(URLS.DATASETS)} />}
        />
        <SentryRoute
          exact
          path={toLocaleRoute(URLS.DATASETS)}
          component={DatasetsPage}
        />
        <SentryRoute
          exact
          path={toLocaleRoute('/login-failure')}
          component={LoginFailure}
        />
        <SentryRoute
          exact
          path={toLocaleRoute('/login-success')}
          component={LoginSuccess}
        />
        <SentryRoute
          exact
          path={toLocaleRoute(URLS.PROFILE)}
          render={() => <Redirect to={toLocaleRoute(URLS.PROFILE_INFO)} />}
        />
        <SentryRoute
          path={toLocaleRoute(URLS.PROFILE + '/')}
          component={ProfileLayoutPage}
        />
        <SentryRoute
          path={toLocaleRoute(URLS.DASHBOARD)}
          component={DashboardPage}
        />
        <SentryRoute
          path={toLocaleRoute(URLS.CRITERIA)}
          component={CriteriaPage}
        />
        {[URLS.CHALLENGE, URLS.STATS, URLS.GOALS, URLS.AWARDS].map(path => (
          <SentryRoute
            key={path}
            exact
            path={toLocaleRoute(path)}
            render={() => (
              <Redirect to={toLocaleRoute(URLS.DASHBOARD + path)} />
            )}
          />
        ))}
        <SentryRoute
          exact
          path={toLocaleRoute(URLS.PROFILE_GOALS)}
          render={() => (
            <Redirect to={toLocaleRoute(URLS.DASHBOARD + '/' + URLS.GOALS)} />
          )}
        />
        <SentryRoute
          exact
          path={toLocaleRoute(URLS.ABOUT)}
          component={AboutPage}
        />
        <SentryRoute
          exact
          path={toLocaleRoute(URLS.PRIVACY)}
          render={() => <DocumentPage key="p" name="privacy" />}
        />
        <SentryRoute
          exact
          path={toLocaleRoute(URLS.TERMS)}
          render={() => <DocumentPage key="t" name="terms" />}
        />
        <SentryRoute
          exact
          path={toLocaleRoute(URLS.CHALLENGE_TERMS)}
          render={() => <DocumentPage key="c" name="challenge-terms" />}
        />
        <SentryRoute
          exact
          path={toLocaleRoute('/landing/sodedif')}
          component={LandingPage}
        />
        <SentryRoute
          path={toLocaleRoute('/404')}
          render={() => (
            <ErrorPage errorCode="404" prevPath={location.state?.prevPath} />
          )}
        />
        <SentryRoute
          path={toLocaleRoute('/503')}
          render={() => (
            <ErrorPage errorCode="503" prevPath={location.state?.prevPath} />
          )}
        />
        <SentryRoute
          exact
          path={toLocaleRoute(URLS.SPEAK)}
          render={() => {
            // note: this is redundant with routing in LocalizedPage in app.tsx, and hanldes
            // locale changing edge cases where toLocaleRoute is still using the old locale
            return <Redirect to={toLocaleRoute(URLS.SPEAK)} />;
          }}
        />
        <SentryRoute
          exact
          path={toLocaleRoute(URLS.LISTEN)}
          render={() => {
            // note: this is redundant with routing in LocalizedPage in app.tsx, and hanldes
            // locale changing edge cases where toLocaleRoute is still using the old locale
            return <Redirect to={toLocaleRoute(URLS.LISTEN)} />;
          }}
        />
        <SentryRoute
          exact
          path={toLocaleRoute(URLS.PARTNER)}
          component={PartnerPage}
        />
        <Route
          render={() => (
            <ErrorPage errorCode="404" prevPath={location.state?.prevPath} />
          )}
        />
      </Switch>
    </React.Suspense>
  );
}
