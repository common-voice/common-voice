import * as React from 'react';
import * as Modal from 'react-modal';
import { Suspense } from 'react';
import { connect, Provider } from 'react-redux';
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
import {
  isMobileSafari,
  isProduction,
  isStaging,
  replacePathLocale,
  doNotTrack,
} from '../utility';
import {
  createLocalization,
  DEFAULT_LOCALE,
  LOCALES,
  negotiateLocales,
} from '../services/localization';
import API from '../services/api';
import { Locale } from '../stores/locale';
import { Notifications } from '../stores/notifications';
import StateTree from '../stores/tree';
import { Uploads } from '../stores/uploads';
import { User } from '../stores/user';
import Layout from './layout/layout';
import DemoLayout from './layout/demo-layout';
import NotificationBanner from './notification-banner/notification-banner';
import NotificationPill from './notification-pill/notification-pill';
import { Spinner } from './ui/ui';
import {
  isContributable,
  localeConnector,
  LocalePropsFromState,
} from './locale-helpers';
import { Flags } from '../stores/flags';
import { ReactLocalization, LocalizationProvider } from '@fluent/react';
// import ErrorSlowBanner from './error-slow-banner/error-slow-banner';
const rtlLocales = require('../../../locales/rtl.json');
const ListenPage = React.lazy(
  () => import('./pages/contribution/listen/listen')
);
const SpeakPage = React.lazy(() => import('./pages/contribution/speak/speak'));

const SentryRoute = Sentry.withSentryRouting(Route);

const SENTRY_DSN_WEB =
  'https://40742891598c4900aacac78dd1145d7e@o1069899.ingest.sentry.io/6251028';

Sentry.init({
  dsn: SENTRY_DSN_WEB,
  integrations: [new BrowserTracing()],
  environment: isProduction() ? 'prod' : 'stage',
  release: process.env.GIT_COMMIT_SHA || null,
});

interface PropsFromState {
  api: API;
  account: UserClient;
  notifications: Notifications.State;
  uploads: Uploads.State;
  messageOverwrites: Flags.MessageOverwrites;
}

interface PropsFromDispatch {
  addNotification: typeof Notifications.actions.addBanner;
  removeUpload: typeof Uploads.actions.remove;
  setLocale: typeof Locale.actions.set;
  refreshUser: typeof User.actions.refresh;
}

interface LocalizedPagesProps
  extends PropsFromState,
    PropsFromDispatch,
    LocalePropsFromState,
    RouteComponentProps<any, any, any> {
  userLocales: string[];
}

interface LocalizedPagesState {
  l10n: ReactLocalization | null;
  uploadPercentage?: number;
}

let LocalizedPage: any = class extends React.Component<
  LocalizedPagesProps,
  LocalizedPagesState
> {
  seenAwardIds: number[] = [];
  state: LocalizedPagesState = {
    l10n: null,
    uploadPercentage: null,
  };

  isUploading = false;

  async componentDidMount() {
    await this.prepareBundleGenerator(this.props);
    this.props.refreshUser();
    Modal.setAppElement('#root');
  }

  async UNSAFE_componentWillReceiveProps(nextProps: LocalizedPagesProps) {
    const { account, addNotification, api, uploads, userLocales } = nextProps;

    this.runUploads(uploads).catch(e => console.error(e));

    window.onbeforeunload =
      uploads.length > 0
        ? (e: any) =>
            (e.returnValue =
              'Leaving the page now aborts pending uploads. Are you sure?')
        : undefined;

    if (userLocales.find((locale, i) => locale !== this.props.userLocales[i])) {
      await this.prepareBundleGenerator(nextProps);
    }

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

  async prepareBundleGenerator({
    api,
    history,
    userLocales,
  }: LocalizedPagesProps) {
    const [mainLocale] = userLocales;
    const pathname = history.location.pathname;

    // Since we make no distinction between "en-US", "en-UK",... we redirect them all to "en"
    if (mainLocale.startsWith('en-')) {
      this.props.setLocale('en');
      history.replace(replacePathLocale(pathname, 'en'));
      return;
    }

    if (!LOCALES.includes(mainLocale)) {
      userLocales[0] = DEFAULT_LOCALE;
      this.props.setLocale(DEFAULT_LOCALE);
      history.replace(replacePathLocale(pathname, DEFAULT_LOCALE));
    } else {
      this.props.setLocale(userLocales[0]);
    }

    const { documentElement } = document;
    documentElement.setAttribute('lang', mainLocale);
    documentElement.setAttribute(
      'dir',
      rtlLocales.includes(mainLocale) ? 'rtl' : 'ltr'
    );

    this.setState({
      l10n: await createLocalization(
        api,
        userLocales,
        this.props.messageOverwrites
      ),
    });
  }

  render() {
    const { locale, notifications, toLocaleRoute, location } = this.props;
    const { l10n, uploadPercentage } = this.state;

    if (!l10n) return null;

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
        <LocalizationProvider l10n={l10n}>
          <>
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

            {/* <ErrorSlowBanner /> */}

            <Switch>
              {[
                { route: URLS.SPEAK, Component: SpeakPage },
                { route: URLS.LISTEN, Component: ListenPage },
              ].map(({ route, Component }: any) => (
                <SentryRoute
                  key={route}
                  exact
                  path={toLocaleRoute(route)}
                  render={props =>
                    isContributable(locale) ? (
                      <Component {...props} />
                    ) : (
                      <Redirect to={toLocaleRoute(URLS.ROOT)} />
                    )
                  }
                />
              ))}
              {location.pathname.includes(URLS.DEMO) ? (
                <DemoLayout />
              ) : (
                <Layout />
              )}
            </Switch>
          </>
        </LocalizationProvider>
      </>
    );
  }
};

LocalizedPage = withRouter(
  localeConnector(
    connect<PropsFromState, PropsFromDispatch>(
      ({ api, flags, notifications, uploads, user }: StateTree) => ({
        account: user.account,
        api,
        messageOverwrites: flags.messageOverwrites,
        notifications,
        uploads,
      }),
      {
        addNotification: Notifications.actions.addBanner,
        removeUpload: Uploads.actions.remove,
        setLocale: Locale.actions.set,
        refreshUser: User.actions.refresh,
      }
    )(LocalizedPage)
  )
);

const history = createBrowserHistory();

class App extends React.Component {
  main: HTMLElement;
  userLocales: string[];

  state: { error: Error } = { error: null };

  /**
   * App will handle routing to page controllers.
   */
  constructor(props: any, context: any) {
    super(props, context);

    if (isMobileSafari()) {
      document.body.classList.add('mobile-safari');
    }

    this.userLocales = negotiateLocales(navigator.languages);
  }

  async componentDidMount() {
    if (!isProduction()) {
      const script = document.createElement('script');
      script.src = 'https://pontoon.mozilla.org/pontoon.js';
      document.head.appendChild(script);
    }
  }

  async componentDidCatch(error: Error, errorInfo: any) {
    this.setState({ error }, () =>
      history.push(`${this.userLocales[0]}/503`, {
        prevPath: history.location.pathname,
      })
    );

    // don't log errors in development
    if (!isProduction() && !isStaging()) {
      return;
    }

    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
      Sentry.captureException(error);
    });
  }

  render() {
    const userLocale = this.userLocales[0];

    return (
      <Suspense fallback={<Spinner />}>
        <Provider store={store}>
          <Router history={history}>
            <Switch>
              {Object.values(URLS).map(url => (
                <SentryRoute
                  key={url}
                  exact
                  path={url || '/'}
                  render={() => (
                    <Redirect to={`/${userLocale}${url}${location.search}`} />
                  )}
                />
              ))}
              <SentryRoute
                path="/pt-BR"
                render={({ location }) => (
                  <Redirect to={location.pathname.replace('pt-BR', 'pt')} />
                )}
              />
              <SentryRoute
                path="/:locale"
                render={({
                  match: {
                    params: { locale },
                  },
                }) =>
                  LOCALES.includes(locale) ? (
                    <LocalizedPage
                      userLocales={[locale, ...this.userLocales]}
                    />
                  ) : (
                    <Redirect
                      push
                      to={{
                        pathname: `/${userLocale}/404`,
                        state: { prevPath: location.pathname },
                      }}
                    />
                  )
                }
              />
            </Switch>
          </Router>
        </Provider>
      </Suspense>
    );
  }
}

export default App;
