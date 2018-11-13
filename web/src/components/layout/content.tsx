import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import URLS from '../../urls';
import {
  isContributable,
  localeConnector,
  LocalePropsFromState,
} from '../locale-helpers';
import DataPage from '../pages/data/data';
import FAQPage from '../pages/faq';
import HomePage from '../pages/home/home';
import LanguagesPages from '../pages/languages/languages';
import NewHomePage from '../pages/new-home/home';
import NotFoundPage from '../pages/not-found';
import DashboardPage from '../pages/dashboard/dashboard';
import DocumentPage from '../pages/document-page';
import ProfileLayoutPage from '../pages/profile/layout';
import ProfilePage from '../pages/profile';

interface Props {
  isRecording: boolean;
  onRecord: Function;
  onRecordStop: Function;
  onVolume: (n: number) => any;
}

export default localeConnector(
  ({
    isRecording,
    locale,
    onRecord,
    onRecordStop,
    onVolume,
    toLocaleRoute,
  }: Props & LocalePropsFromState) => (
    <div id="content">
      <Switch>
        <Route exact path={toLocaleRoute(URLS.ROOT)} component={HomePage} />
        <Route exact path={toLocaleRoute('/new')} component={NewHomePage} />
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
        <Route exact path={toLocaleRoute(URLS.DATASETS)} component={DataPage} />
        <Route
          exact
          path={toLocaleRoute(URLS.PROFILE)}
          component={ProfilePage}
        />
        <Route
          path={toLocaleRoute(URLS.PROFILE + '/')}
          component={ProfileLayoutPage}
        />
        <Route path={toLocaleRoute(URLS.DASHBOARD)} component={DashboardPage} />
        <Route exact path={toLocaleRoute(URLS.FAQ)} component={FAQPage} />
        <Route
          exact
          path={toLocaleRoute(URLS.PRIVACY)}
          render={() => <DocumentPage name="privacy" />}
        />
        <Route
          exact
          path={toLocaleRoute(URLS.TERMS)}
          render={() => <DocumentPage name="terms" />}
        />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  )
);
