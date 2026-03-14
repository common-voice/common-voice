import * as React from 'react'
import { Switch, Route, Redirect } from 'react-router'
import * as Sentry from '@sentry/react'

import URLS from '../../urls'
import { isContributable, useLocale } from '../locale-helpers'
import DocumentPage from '../pages/document-page'
import { Spinner } from '../ui/ui'
import { LoginFailure, LoginSuccess } from '../pages/login'
import lazyWithRetry from '../../lazy-with-retry'

const HomePage = lazyWithRetry(() => import('../pages/home'))
const DatasetsPage = lazyWithRetry(() => import('../pages/datasets/datasets'))
const LanguagesPage = lazyWithRetry(
  () => import('../pages/languages/languages')
)
const LanguagesRequestPage = lazyWithRetry(
  () => import('../pages/languages/request/request')
)
const LanguagesRequestSuccessPage = lazyWithRetry(
  () => import('../pages/languages/request/request-success')
)
const DashboardPage = lazyWithRetry(
  () => import('../pages/dashboard/dashboard')
)
const ProfileLayoutPage = lazyWithRetry(
  () => import('../pages/profile/layout')
)
const AboutPage = lazyWithRetry(() => import('../pages/about/about'))
const LandingPage = lazyWithRetry(() => import('../pages/landing/landing'))
const ErrorPage = lazyWithRetry(
  () => import('../pages/error-page/error-page')
)
const PartnerPage = lazyWithRetry(() => import('../pages/partner/partner'))
const GuidelinesPage = lazyWithRetry(
  () => import('../pages/guidelines/guidelines')
)
const SentenceCollectorRedirectPage = lazyWithRetry(
  () =>
    import('../pages/sentence-collector-redirect/sentence-collector-redirect')
)

const SentryRoute = Sentry.withSentryRouting(Route)

const ExternalRedirect: React.FC<{ to: string }> = ({ to }) => {
  React.useEffect(() => {
    window.location.assign(to)
  }, [to])

  return null
}

export default function Content({ location }: { location: any }) {
  const [locale, toLocaleRoute] = useLocale()
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
          render={() => <ExternalRedirect to={URLS.MDC_DATASETS} />}
        />
        <SentryRoute
          exact
          path={toLocaleRoute(URLS.DATASETS)}
          render={() => <ExternalRedirect to={URLS.MDC_DATASETS} />}
        />
        <SentryRoute
          exact
          path={toLocaleRoute(URLS.OLDDATASETS)}
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
          render={() => <Redirect to={toLocaleRoute(URLS.GUIDELINES)} />}
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
          path={toLocaleRoute(URLS.FAQ)}
          render={() => <Redirect to={toLocaleRoute(URLS.ABOUT)} />}
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
            // note: this is redundant with routing in LocalizedPage in app.tsx, and handles
            // locale changing edge cases where toLocaleRoute is still using the old locale
            return <Redirect to={toLocaleRoute(URLS.SPEAK)} />
          }}
        />
        <SentryRoute
          exact
          path={toLocaleRoute(URLS.LISTEN)}
          render={() => {
            // note: this is redundant with routing in LocalizedPage in app.tsx, and handles
            // locale changing edge cases where toLocaleRoute is still using the old locale
            return <Redirect to={toLocaleRoute(URLS.LISTEN)} />
          }}
        />
        <SentryRoute
          exact
          path={toLocaleRoute(URLS.PARTNER)}
          component={PartnerPage}
        />
        <SentryRoute
          exact
          path={toLocaleRoute(URLS.WRITE)}
          render={() => {
            // note: this is redundant with routing in LocalizedPage in app.tsx, and handles
            // locale changing edge cases where toLocaleRoute is still using the old locale
            return <Redirect to={toLocaleRoute(URLS.WRITE)} />
          }}
        />
        <SentryRoute
          exact
          path={toLocaleRoute(URLS.GUIDELINES)}
          component={GuidelinesPage}
        />
        <SentryRoute
          exact
          path={toLocaleRoute(URLS.SENTENCE_COLLECTOR_REDIRECT)}
          component={SentenceCollectorRedirectPage}
        />
        <Route
          render={() => (
            <ErrorPage errorCode="404" prevPath={location.state?.prevPath} />
          )}
        />
      </Switch>
    </React.Suspense>
  )
}
