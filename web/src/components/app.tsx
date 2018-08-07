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
const { LocalizationProvider } = require('fluent-react');
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
  createMessagesGenerator,
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
import ListenPage from './pages/contribution/listen/listen';
import SpeakPage from './pages/contribution/speak/speak';
import {
  isContributable,
  localeConnector,
  LocalePropsFromState,
} from './locale-helpers';
import { CloseIcon } from './ui/icons';

const LOAD_TIMEOUT = 5000; // we can only wait so long.
const SURVEY_KEY = 'showSurvey';

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
  messagesGenerator: any;
  showSurvey: boolean;
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
          messagesGenerator: null,
          showSurvey: JSON.parse(localStorage.getItem(SURVEY_KEY)) !== false,
          uploadPercentage: null,
        };

        isUploading = false;

        async componentDidMount() {
          await this.prepareMessagesGenerator(this.props);
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
            await this.prepareMessagesGenerator(nextProps);
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

        async prepareMessagesGenerator({
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
            messagesGenerator: await createMessagesGenerator(api, userLocales),
          });
        }

        handleScroll = () => {
          this.setState({ hasScrolled: true });
        };

        hideSurvey = (options?: { immediately: boolean }) => {
          const { immediately } = { immediately: true, ...options };
          if (immediately) this.setState({ showSurvey: false });
          localStorage.setItem(SURVEY_KEY, JSON.stringify(false));
        };

        render() {
          const { locale, notifications, toLocaleRoute } = this.props;
          const {
            hasScrolled,
            messagesGenerator,
            showSurvey,
            uploadPercentage,
          } = this.state;
          return (
            messagesGenerator && (
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
                <LocalizationProvider messages={messagesGenerator}>
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

                    {showSurvey &&
                      hasScrolled && (
                        <div className="survey">
                          <button onClick={() => this.hideSurvey()}>
                            <CloseIcon black />
                          </button>
                          <h1>Penny for your thoughts?</h1>
                          <p>
                            We would love to know more about how you use Common
                            Voice, what you like and don’t like about it. Could
                            you spare 5 min to give us some quick feedback
                            through our survey?
                          </p>
                          <a
                            href="https://www.surveygizmo.com/s3/4446677/3a21d4a69b6b"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() =>
                              this.hideSurvey({ immediately: false })
                            }>
                            Go to survey
                          </a>
                        </div>
                      )}

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
