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
import StateTree from '../stores/tree';
import { Uploads } from '../stores/uploads';
import Layout from './layout/layout';
import ListenPage from './pages/contribution/listen/listen';
import SpeakPage from './pages/contribution/speak/speak';
import { localeConnector, LocalePropsFromState } from './locale-helpers';

const LOAD_TIMEOUT = 5000; // we can only wait so long.

/**
 * Preload these images before revealing contents.
 * TODO: right now we load all images, which is unnecessary.
 */
const PRELOAD = [
  '/img/cv-logo-bw.svg',
  '/img/cv-logo-one-color-white.svg',
  '/img/robot-greetings.png',
  '/img/robot-listening.png',
  '/img/robot-thinking.png',
  '/img/robot-thumbs-up.png',
  '/img/wave-blue-large.png',
  '/img/wave-blue-mobile.png',
  '/img/wave-red-large.png',
  '/img/wave-red-mobile.png',
  '/img/waves/_1.svg',
  '/img/waves/_2.svg',
  '/img/waves/_3.svg',
  '/img/waves/fading.svg',
  '/img/waves/Eq.svg',
];

interface PropsFromState {
  api: API;
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
  messagesGenerator: any;
}

const LocalizedLayout: any = withRouter(
  localeConnector(
    connect<PropsFromState, PropsFromDispatch>(
      ({ api, uploads }: StateTree) => ({
        api,
        uploads,
      }),
      { removeUpload: Uploads.actions.remove, setLocale: Locale.actions.set }
    )(
      class extends React.Component<LocalizedPagesProps, LocalizedPagesState> {
        state: LocalizedPagesState = {
          messagesGenerator: null,
        };

        isUploading = false;

        async componentDidMount() {
          await this.prepareMessagesGenerator(this.props);
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

        async runUploads(uploads: Uploads.State) {
          if (this.isUploading) return;
          this.isUploading = true;
          for (const upload of uploads) {
            await upload();
            this.props.removeUpload(upload);
          }
          this.isUploading = false;
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

        render() {
          const { messagesGenerator } = this.state;
          const { toLocaleRoute } = this.props;
          return (
            messagesGenerator && (
              <LocalizationProvider messages={messagesGenerator}>
                <Switch>
                  <Route
                    exact
                    path={toLocaleRoute(URLS.SPEAK)}
                    component={SpeakPage}
                  />
                  <Route
                    exact
                    path={toLocaleRoute(URLS.LISTEN)}
                    component={ListenPage}
                  />
                  <Layout />
                </Switch>
              </LocalizationProvider>
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
