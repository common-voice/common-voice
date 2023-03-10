import * as React from 'react';
import * as Modal from 'react-modal';
import { Suspense } from 'react';
import { connect, Provider as ReduxProvider } from 'react-redux';
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from 'react-router';
import { Router } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { createBrowserHistory } from 'history';

import { UserClient } from 'common';
import store from '../stores/root';
import URLS from '../urls';
import { isMobileSafari, isProduction, shouldEmitErrors } from '../utility';
import API from '../services/api';
import { Locale } from '../stores/locale';
import * as Languages from '../stores/languages';
import { Notifications } from '../stores/notifications';
import StateTree from '../stores/tree';
import { Uploads } from '../stores/uploads';
import { User } from '../stores/user';
import Layout from './layout/layout';
import NotificationPill from './notification-pill/notification-pill';
import { Spinner } from './ui/ui';
import { localeConnector, LocalePropsFromState } from './locale-helpers';
import { Flags } from '../stores/flags';

import LanguagesProvider from './languages-provider';
import ErrorBoundary from './error-boundary/error-boundary';
import LocalizedErrorBoundary from './error-boundary/localized-error-boundary';

const ListenPage = React.lazy(
  () => import('./pages/contribution/listen/listen')
);
const SpeakPage = React.lazy(() => import('./pages/contribution/speak/speak'));
const WritePage = React.lazy(() => import('./pages/contribution/write/write'));
const DemoPage = React.lazy(() => import('./layout/demo-layout'));

const SentryRoute = Sentry.withSentryRouting(Route);

const SENTRY_DSN_WEB =
  'https://40742891598c4900aacac78dd1145d7e@o1069899.ingest.sentry.io/6251028';

Sentry.init({
  dsn: shouldEmitErrors() ? SENTRY_DSN_WEB : null,
  integrations: [new BrowserTracing()],
  environment: isProduction() ? 'prod' : 'stage',
  release: process.env.GIT_COMMIT_SHA || null,
});

interface PropsFromState {
  api: API;
  account: UserClient;
  notifications: Notifications.State;
  uploads: Uploads.State;
  languages: Languages.State;
  messageOverwrites: Flags.MessageOverwrites;
}

interface PropsFromDispatch {
  addNotification: typeof Notifications.actions.addBanner;
  removeUpload: typeof Uploads.actions.remove;
  setLocale: typeof Locale.actions.set;
  refreshUser: typeof User.actions.refresh;
  updateUser: typeof User.actions.update;
}

interface LocalizedPagesProps
  extends PropsFromState,
    PropsFromDispatch,
    LocalePropsFromState,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    RouteComponentProps<any, any, any> {}

interface LocalizedPagesState {
  uploadPercentage?: number;
}

let LocalizedPage: any = class extends React.Component<
  LocalizedPagesProps,
  LocalizedPagesState
> {
  seenAwardIds: number[] = [];
  state: LocalizedPagesState = {
    uploadPercentage: null,
  };

  isUploading = false;

  async componentDidMount() {
    this.props.updateUser({});
    this.props.refreshUser();

    if (isMobileSafari()) {
      document.body.classList.add('mobile-safari');
    }

    Modal.setAppElement('#root');
  }

  async UNSAFE_componentWillReceiveProps(nextProps: LocalizedPagesProps) {
    const { account, addNotification, api, uploads } = nextProps;

    this.runUploads(uploads).catch(e => console.error(e));

    window.onbeforeunload =
      uploads.length > 0
        ? (e: any) =>
            (e.returnValue =
              'Leaving the page now aborts pending uploads. Are you sure?')
        : undefined;

    const award = account?.awards
      ? account.awards.find(
          a => !a.notification_seen_at && !this.seenAwardIds.includes(a.id)
        )
      : null;

    if (award) {
      this.seenAwardIds.push(...account.awards.map(a => a.id));
      addNotification(
        `Success, ${award.amount} Clip ${
          award.days_interval == 1 ? 'daily' : 'weekly'
        } goal achieved!`,
        {
          links: [
            {
              children: 'Check out your award!',
              to: URLS.AWARDS,
            },
          ],
        }
      );
      await api.seenAwards('notification');
    }
  }

  async runUploads(uploads: Uploads.State) {
    if (this.isUploading) return;
    this.isUploading = true;
    this.setState({ uploadPercentage: 0 });
    for (let i = 0; i < uploads.length; i++) {
      this.setState({ uploadPercentage: (i + 1) / (uploads.length + 1) });
      const upload = uploads[i];
      try {
        await upload();
      } catch (e) {
        console.error('upload error', e);
      }
      this.props.removeUpload(upload);
    }
    this.setState({ uploadPercentage: null });
    this.isUploading = false;

    if (this.props.uploads.length > 0) {
      await this.runUploads(this.props.uploads);
    }
  }

  render() {
    const { locale, notifications, toLocaleRoute, location, languages } =
      this.props;
    const { uploadPercentage } = this.state;

    const isContributable = languages.contributableLocales.includes(locale);

    return (
      <>
        <div
          className="upload-progress"
          style={
            uploadPercentage === null
              ? {
                  opacity: 0,
                  width: '100%',
                  background: '#59cbb7',
                  animationPlayState: 'paused',
                }
              : {
                  opacity: 1,
                  width: uploadPercentage * 100 + '%',
                  animationPlayState: 'running',
                }
          }
        />
        <div className="notifications">
          {notifications
            .slice()
            .reverse()
            .map(
              notification =>
                notification.kind == 'pill' &&
                notification.type !== 'achievement' && (
                  <NotificationPill
                    key={notification.id}
                    notification={notification}
                  />
                )
            )}
        </div>

        <Switch>
          {[
            { route: URLS.SPEAK, Component: SpeakPage },
            { route: URLS.LISTEN, Component: ListenPage },
            { route: URLS.WRITE, Component: WritePage },
          ].map(({ route, Component }: any) => (
            <SentryRoute
              key={route}
              exact
              path={toLocaleRoute(route)}
              render={props =>
                isContributable ? (
                  <Layout shouldHideFooter>
                    <Component {...props} />
                  </Layout>
                ) : (
                  <Redirect to={toLocaleRoute(URLS.ROOT)} />
                )
              }
            />
          ))}
          {location.pathname.includes(URLS.DEMO) ? <DemoPage /> : <Layout />}
        </Switch>
      </>
    );
  }
};

LocalizedPage.displayName = 'LocalizedPage';

LocalizedPage = withRouter(
  localeConnector(
    connect<PropsFromState, PropsFromDispatch>(
      ({ api, flags, notifications, languages, uploads, user }: StateTree) => ({
        account: user.account,
        api,
        messageOverwrites: flags.messageOverwrites,
        notifications,
        uploads,
        languages,
      }),
      {
        addNotification: Notifications.actions.addBanner,
        removeUpload: Uploads.actions.remove,
        setLocale: Locale.actions.set,
        refreshUser: User.actions.refresh,
        updateUser: User.actions.update,
      }
    )(LocalizedPage)
  )
);

const App = () => {
  const history = createBrowserHistory();

  return (
    <Suspense fallback={<Spinner />}>
      <ErrorBoundary>
        <ReduxProvider store={store}>
          <Router history={history}>
            <LanguagesProvider>
              <LocalizedErrorBoundary>
                <LocalizedPage />
              </LocalizedErrorBoundary>
            </LanguagesProvider>
          </Router>
        </ReduxProvider>
      </ErrorBoundary>
    </Suspense>
  );
};

export default App;
