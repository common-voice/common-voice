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
import NotFoundPage from '../pages/not-found';
import DocumentPage from '../pages/document-page';
import ProfilePage from '../pages/profile';
import RecordPage from '../pages/record/record';

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
        {isContributable(locale) ? (
          <Route
            exact
            path={toLocaleRoute(URLS.RECORD)}
            render={props => (
              <RecordPage
                isRecording={isRecording}
                onRecord={onRecord}
                onRecordStop={onRecordStop}
                onVolume={onVolume}
                {...props}
              />
            )}
          />
        ) : (
          <Route
            exact
            path={toLocaleRoute(URLS.RECORD)}
            render={() => <Redirect to={toLocaleRoute(URLS.ROOT)} />}
          />
        )}
        <Route
          exact
          path={toLocaleRoute(URLS.LANGUAGES)}
          component={LanguagesPages}
        />
        <Route exact path={toLocaleRoute(URLS.DATA)} component={DataPage} />
        <Route
          exact
          path={toLocaleRoute(URLS.PROFILE)}
          component={ProfilePage}
        />
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
