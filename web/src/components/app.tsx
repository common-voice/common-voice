import * as React from 'react';
import { connect, Provider } from 'react-redux';
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from 'react-router';
import { Router } from 'react-router-dom';
const { LocalizationProvider } = require('fluent-react/compat');
import { createBrowserHistory } from 'history';
import store from '../stores/root';
import URLS from '../urls';
import {
  isMobileWebkit,
  isFirefoxFocus,
  isNativeIOS,
  sleep,
  isProduction,
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
import Layout from './layout/layout';
import NotificationPill from './notification-pill/notification-pill';
import { LoginFailure, LoginSuccess } from './pages/login';
import ListenPage from './pages/contribution/listen/listen';
import SpeakPage from './pages/contribution/speak/speak';
import {
  isContributable,
  localeConnector,
  LocalePropsFromState,
} from './locale-helpers';

const LOAD_TIMEOUT = 5000; // we can only wait so long.

/**
 * Preload these images before revealing contents.
 * TODO: right now we load all images, which is unnecessary.
 */
const PRELOAD = [
  '/img/cv-logo-bw.svg',
  '/img/cv-logo-one-color-white.svg',
  '/img/robot-greetings.png',
  '/img/wave-blue-large.png',
  '/img/wave-blue-mobile.png',
  '/img/waves/_1.svg',
  '/img/waves/_2.svg',
  '/img/waves/_3.svg',
  '/img/waves/fading.svg',
  '/img/waves/Eq.svg',
];

interface PropsFromState {
  api: API;
  notifications: Notifications.State;
  uploads: Uploads.State;
}

interface PropsFromDispatch {
  removeUpload: typeof Uploads.actions.remove;
  setLocale: typeof Locale.actions.set;
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

const LocalizedLayout: any = withRouter(
  localeConnector(
    connect<PropsFromState, PropsFromDispatch>(
      ({ api, notifications, uploads }: StateTree) => ({
        api,
        notifications,
        uploads,
      }),
      { removeUpload: Uploads.actions.remove, setLocale: Locale.actions.set }
    )(
      class extends React.Component<LocalizedPagesProps, LocalizedPagesState> {
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

          if (
            userLocales.find(
              (locale, i) => locale !== this.props.userLocales[i]
            )
          ) {
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

          document.documentElement.setAttribute('lang', mainLocale);

          this.setState({
            bundleGenerator: await createBundleGenerator(api, userLocales),
          });
        }

        handleScroll = () => {
          this.setState({ hasScrolled: true });
        };

        render() {
          const { locale, notifications, toLocaleRoute } = this.props;
          const { hasScrolled, bundleGenerator, uploadPercentage } = this.state;
          return (
            bundleGenerator && (
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
                          <NotificationPill
                            key={notification.id}
                            {...notification}
                          />
                        ))}
                    </div>

                    <Switch>
                      <Route
                        exact
                        path={toLocaleRoute(URLS.SPEAK)}
                        render={props =>
                          isContributable(locale) ? (
                            <SpeakPage {...props} />
                          ) : (
                            <Redirect to={toLocaleRoute(URLS.ROOT)} />
                          )
                        }
                      />
                      <Route
                        exact
                        path={toLocaleRoute(URLS.LISTEN)}
                        render={props =>
                          isContributable(locale) ? (
                            <ListenPage {...props} />
                          ) : (
                            <Redirect to={toLocaleRoute(URLS.ROOT)} />
                          )
                        }
                      />
                      <Layout />
                    </Switch>
                  </div>
                </LocalizationProvider>
              </div>
            )
          );
        }
      }
    )
  )
);

const history = createBrowserHistory();

interface State {
  loaded: boolean;
}

class App extends React.Component<void, State> {
  main: HTMLElement;
  userLocales: string[];

  state: State = {
    loaded: false,
  };

  /**
   * App will handle routing to page controllers.
   */
  constructor(props: void, context: any) {
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

  /**
   * Pre-Load all images before first content render.
   */
  private preloadImages(): Promise<void> {
    return new Promise<void>(resolve => {
      let loadedSoFar = 0;
      const onLoad = () => {
        ++loadedSoFar;
        if (loadedSoFar === PRELOAD.length) {
          resolve();
        }
      };
      PRELOAD.forEach(imageUrl => {
        const image = new Image();
        image.addEventListener('load', onLoad);
        image.src = imageUrl;
      });
    });
  }

  /**
   * Perform any native iOS specific operations.
   */
  private bootstrapIOS() {
    document.body.classList.add('ios');
  }

  async componentDidMount() {
    if (!isProduction()) {
      const script = document.createElement('script');
      script.src = 'https://pontoon.mozilla.org/pontoon.js';
      document.head.appendChild(script);
    }

    await Promise.all([
      Promise.race([sleep(LOAD_TIMEOUT), this.preloadImages()]).then(() =>
        this.setState({ loaded: true })
      ),
    ]);
  }

  render() {
    return this.state.loaded ? (
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
                render={() => <Redirect to={'/' + this.userLocales[0] + url} />}
              />
            ))}
            <Route
              path="/:locale"
              render={({ match: { params: { locale } } }) => (
                <LocalizedLayout userLocales={[locale, ...this.userLocales]} />
              )}
            />
          </Switch>
        </Router>
      </Provider>
    ) : (
      <div id="spinner">
        <span />
      </div>
    );
  }
}

export default App;
