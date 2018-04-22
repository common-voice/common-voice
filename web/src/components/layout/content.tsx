import * as React from 'react';
import { Switch, Route } from 'react-router';
import URLS from '../../urls';
import { localeConnector, LocalePropsFromState } from '../locale-helpers';
import DataPage from '../pages/data/data';
import FAQPage from '../pages/faq';
import HomePage from '../pages/home/home';
import LanguagesPages from '../pages/languages/languages';
import NotFoundPage from '../pages/not-found';
import PrivacyPage from '../pages/privacy';
import ProfilePage from '../pages/profile';
import RecordPage from '../pages/record/record';
import TermsPage from '../pages/terms';
import { CONTRIBUTABLE_LOCALES } from '../../services/localization';

interface Props {
  containerRef: React.Ref<HTMLElement>;
  isRecording: boolean;
  onRecord: Function;
  onRecordStop: Function;
  onVolume: (n: number) => any;
}

export default localeConnector(
  ({
    containerRef,
    isRecording,
    locale,
    onRecord,
    onRecordStop,
    onVolume,
    toLocaleRoute,
  }: Props & LocalePropsFromState) => (
    <div id="content" ref={containerRef}>
      <Switch>
        <Route exact path={toLocaleRoute(URLS.ROOT)} component={HomePage} />
        {CONTRIBUTABLE_LOCALES.includes(locale) && (
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
          component={PrivacyPage}
        />
        <Route exact path={toLocaleRoute(URLS.TERMS)} component={TermsPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  )
);
