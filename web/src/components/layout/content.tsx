import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import URLS from '../../urls';
import {
  isContributable,
  localeConnector,
  LocalePropsFromState,
} from '../locale-helpers';
import FAQPage from '../pages/faq';
import DocumentPage from '../pages/document-page';
import NotFoundPage from '../pages/not-found';
import { Spinner } from '../ui/ui';
const HomePage = React.lazy(() => import('../pages/home/home'));
const DataPage = React.lazy(() => import('../pages/data/data'));
const LanguagesPages = React.lazy(() => import('../pages/languages/languages'));
const DashboardPage = React.lazy(() => import('../pages/dashboard/dashboard'));
const ProfileLayoutPage = React.lazy(() => import('../pages/profile/layout'));

export default localeConnector(
  ({ locale, toLocaleRoute }: LocalePropsFromState) => (
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
            component={DataPage}
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
          <Route exact path={toLocaleRoute(URLS.FAQ)} component={FAQPage} />
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
          <Route component={NotFoundPage} />
        </Switch>
      </React.Suspense>
    </div>
  )
);
