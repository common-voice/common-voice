import * as React from 'react';
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
import { createBrowserHistory } from 'history';
import store from '../stores/root';
import URLS from '../urls';
import {
  isFirefoxFocus,
  isMobileWebkit,
  isNativeIOS,
  isProduction,
  isStaging,
  replacePathLocale,
} from '../utility';
import {
  createBundleGenerator,
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
import NotificationPill from './notification-pill/notification-pill';
import { LoginFailure, LoginSuccess } from './pages/login';
import { Spinner } from './ui/ui';
import {
  isContributable,
  localeConnector,
  LocalePropsFromState,
} from './locale-helpers';
import { Flags } from '../stores/flags';

const { LocalizationProvider } = require('fluent-react/compat');
const rtlLocales = require('../../../locales/rtl.json');
const ListenPage = React.lazy(() =>
  import('./pages/contribution/listen/listen')
);
const SpeakPage = React.lazy(() => import('./pages/contribution/speak/speak'));

interface PropsFromState {
  api: API;
  notifications: Notifications.State;
  uploads: Uploads.State;
  messageOverwrites: Flags.MessageOverwrites;
}

interface PropsFromDispatch {
  removeUpload: typeof Uploads.actions.remove;
  setLocale: typeof Locale.actions.set;
  refreshUser: typeof User.actions.refresh;
}

interface LocalizedPagesProps
  extends PropsFromState,
    PropsFromDispatch,
    LocalePropsFromState,
    RouteComponentProps<any> {
  userLocales: string[];
}

interface LocalizedPagesState {
  hasScrolled: boolean;
  bundleGenerator: any;
  uploadPercentage?: number;
}

let LocalizedPage: any = class extends React.Component<
  LocalizedPagesProps,
  LocalizedPagesState
> {
  state: LocalizedPagesState = {
    hasScrolled: false,
    bundleGenerator: null,
    uploadPercentage: null,
  };

  isUploading = false;

  async componentDidMount() {
    await this.prepareBundleGenerator(this.props);
    window.addEventListener('scroll', this.handleScroll);
    setTimeout(() => this.setState({ hasScrolled: true }), 5000);
    this.props.refreshUser();
  }

  async componentWillReceiveProps(nextProps: LocalizedPagesProps) {
    const { uploads, userLocales } = nextProps;

    this.runUploads(uploads).catch(e => console.error(e));

    window.onbeforeunload =
      uploads.length > 0
        ? e =>
            (e.returnValue =
              'Leaving the page now aborts pending uploads. Are you sure?')
        : undefined;

    if (userLocales.find((locale, i) => locale !== this.props.userLocales[i])) {
      await this.prepareBundleGenerator(nextProps);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
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
      bundleGenerator: await createBundleGenerator(
        api,
        userLocales,
        this.props.messageOverwrites
      ),
    });
  }

  handleScroll = () => {
    this.setState({ hasScrolled: true });
  };

  render() {
    const { locale, notifications, toLocaleRoute } = this.props;
    const { bundleGenerator, uploadPercentage } = this.state;

    if (!bundleGenerator) return null;

    return (
      <div>
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
        <LocalizationProvider bundles={bundleGenerator}>
          <div>
            <div className="notifications">
              {notifications
                .slice()
                .reverse()
                .map(notification => (
                  <NotificationPill key={notification.id} {...notification} />
                ))}
            </div>

            <Switch>
              {[
                { route: URLS.SPEAK, Component: SpeakPage },
                { route: URLS.LISTEN, Component: ListenPage },
              ].map(({ route, Component }) => (
                <Route
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
              <Layout />
            </Switch>
          </div>
        </LocalizationProvider>
      </div>
    );
  }
};

LocalizedPage = withRouter(
  localeConnector(
    connect<PropsFromState, PropsFromDispatch>(
      ({ api, flags, notifications, uploads }: StateTree) => ({
        api,
        messageOverwrites: flags.messageOverwrites,
        notifications,
        uploads,
      }),
      {
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

  state: { error: Error; Sentry: any } = { error: null, Sentry: null };

  /**
   * App will handle routing to page controllers.
   */
  constructor(props: any, context: any) {
    super(props, context);

    if (isNativeIOS()) {
      this.bootstrapIOS();
    }

    if (isFirefoxFocus()) {
      document.body.classList.add('focus');
    }

    if (isMobileWebkit()) {
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
    this.setState({ error });

    if (!isProduction() && !isStaging()) {
      return;
    }
    const Sentry = await import('@sentry/browser');
    Sentry.init({
      dsn: 'https://e0ca8e37ef77492eb3ff46caeca385e5@sentry.io/1352219',
    });
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
      Sentry.captureException(error);
    });
    this.setState({ Sentry });
  }

  /**
   * Perform any native iOS specific operations.
   */
  private bootstrapIOS() {
    document.body.classList.add('ios');
  }

  render() {
    const { error, Sentry } = this.state;
    if (error) {
      return (
        <div>
          An error occurred. Sorry!
          <br />
          <button onClick={() => Sentry.showReportDialog()} disabled={!Sentry}>
            Report feedback
          </button>
          <br />
          <button onClick={() => location.reload()}>Reload</button>
        </div>
      );
    }

    return (
      <Suspense fallback={<Spinner />}>
        <Provider store={store}>
          <Router history={history}>
            <Switch>
              <Route exact path="/login-failure" component={LoginFailure} />
              <Route exact path="/login-success" component={LoginSuccess} />
              {Object.values(URLS).map(url => (
                <Route
                  key={url}
                  exact
                  path={url || '/'}
                  render={() => (
                    <Redirect
                      to={'/' + this.userLocales[0] + url + location.search}
                    />
                  )}
                />
              ))}
              <Route
                path="/:locale"
                render={({
                  match: {
                    params: { locale },
                  },
                }) => (
                  <LocalizedPage userLocales={[locale, ...this.userLocales]} />
                )}
              />
            </Switch>
          </Router>
        </Provider>
      </Suspense>
    );
  }
}

export default App;
