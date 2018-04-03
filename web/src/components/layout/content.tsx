import * as React from 'react';
import { Switch, Route } from 'react-router';
import URLS from '../../urls';
import DataPage from '../pages/data/data';
import FAQPage from '../pages/faq';
import HomePage from '../pages/home/home';
import LanguagesPages from '../pages/languages/languages';
import NotFoundPage from '../pages/not-found';
import PrivacyPage from '../pages/privacy';
import ProfilePage from '../pages/profile';
import RecordPage from '../pages/record/record';
import TermsPage from '../pages/terms';

interface Props {
  basePath: string;
  isRecording: boolean;
  onRecord: Function;
  onRecordStop: Function;
  onVolume: (n: number) => any;
}

export default class Content extends React.Component<Props> {
  container: HTMLElement;

  render() {
    const {
      basePath,
      isRecording,
      onRecord,
      onRecordStop,
      onVolume,
    } = this.props;
    return (
      <div
        id="content"
        ref={div => {
          this.container = div as HTMLElement;
        }}>
        <Switch>
          <Route exact path={basePath + URLS.ROOT} component={HomePage} />
          <Route
            exact
            path={basePath + URLS.RECORD}
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
          <Route
            exact
            path={basePath + URLS.LANGUAGES}
            component={LanguagesPages}
          />
          <Route exact path={basePath + URLS.DATA} component={DataPage} />
          <Route exact path={basePath + URLS.PROFILE} component={ProfilePage} />
          <Route exact path={basePath + URLS.FAQ} component={FAQPage} />
          <Route exact path={basePath + URLS.PRIVACY} component={PrivacyPage} />
          <Route exact path={basePath + URLS.TERMS} component={TermsPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    );
  }
}
