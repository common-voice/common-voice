import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import URLS from '../../urls';
import { isContributable, useLocale } from '../locale-helpers';
import DocumentPage from '../pages/document-page';
import NotFoundPage from '../pages/not-found';
import { Spinner } from '../ui/ui';
import { LoginFailure, LoginSuccess } from '../pages/login';
const HomePage = React.lazy(() => import('../pages/home/home'));
const DatasetsPage = React.lazy(() => import('../pages/datasets/datasets'));
const LanguagesPages = React.lazy(() => import('../pages/languages/languages'));
const DashboardPage = React.lazy(() => import('../pages/dashboard/dashboard'));
const ProfileLayoutPage = React.lazy(() => import('../pages/profile/layout'));
const FAQPage = React.lazy(() => import('../pages/faq/faq'));
const AboutPage = React.lazy(() => import('../pages/about/about'));
const LandingPage = React.lazy(() => import('../pages/landing/landing'));

export default function Content() {
  const [locale, toLocaleRoute] = useLocale();
  return (
    <div id="content">
      <React.Suspense fallback={<Spinner />}>
        <Switch>
          <Route exact path={toLocaleRoute(URLS.ROOT)} component={HomePage} />
          <Route
            exact
            path={toLocaleRoute('/new')}
            render={() => <Redirect to={toLocaleRoute(URLS.ROOT)} />}
          />
          <Route
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
          <Route
            exact
            path={toLocaleRoute(URLS.LANGUAGES)}
            component={LanguagesPages}
          />
          <Route
            exact
            path={toLocaleRoute(URLS.DATA)}
            render={() => <Redirect to={toLocaleRoute(URLS.DATASETS)} />}
          />
          <Route
            exact
            path={toLocaleRoute(URLS.DATASETS)}
            component={DatasetsPage}
          />
          <Route
            exact
            path={toLocaleRoute('/login-failure')}
            component={LoginFailure}
          />
          <Route
            exact
            path={toLocaleRoute('/login-success')}
            component={LoginSuccess}
          />
          <Route
            exact
            path={toLocaleRoute(URLS.PROFILE)}
            render={() => <Redirect to={toLocaleRoute(URLS.PROFILE_INFO)} />}
          />
          <Route
            path={toLocaleRoute(URLS.PROFILE + '/')}
            component={ProfileLayoutPage}
          />
          <Route
            path={toLocaleRoute(URLS.DASHBOARD)}
            component={DashboardPage}
          />
          {[URLS.STATS, URLS.GOALS, URLS.AWARDS].map(path => (
            <Route
              key={path}
              exact
              path={toLocaleRoute(path)}
              render={() => (
                <Redirect to={toLocaleRoute(URLS.DASHBOARD + path)} />
              )}
            />
          ))}
          <Route
            exact
            path={toLocaleRoute(URLS.PROFILE_GOALS)}
            render={() => (
              <Redirect to={toLocaleRoute(URLS.DASHBOARD + '/' + URLS.GOALS)} />
            )}
          />
          <Route exact path={toLocaleRoute(URLS.FAQ)} component={FAQPage} />
          <Route exact path={toLocaleRoute(URLS.ABOUT)} component={AboutPage} />
          <Route
            exact
            path={toLocaleRoute(URLS.PRIVACY)}
            render={() => <DocumentPage key="p" name="privacy" />}
          />
          <Route
            exact
            path={toLocaleRoute(URLS.TERMS)}
            render={() => <DocumentPage key="t" name="terms" />}
          />
          <Route
            exact
            path={toLocaleRoute('/landing/sodedif')}
            component={LandingPage}
          />
          <Route component={NotFoundPage} />
        </Switch>
      </React.Suspense>
    </div>
  );
}
