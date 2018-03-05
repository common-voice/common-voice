import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
const { LocalizationProvider } = require('fluent-react');
import store from '../stores/root';
import { isMobileWebkit, isFocus, isNativeIOS, sleep } from '../utility';
import { createMessagesGenerator } from '../services/localization';
import Pages from './pages';
import API from '../services/api';
import StateTree from '../stores/tree';

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
];

interface PropsFromState {
  api: API;
}

interface State {
  loaded: boolean;
  locale: string;
  locales: {
    [code: string]: string;
  };
  messagesGenerator: any;
}

class App extends React.Component<PropsFromState, State> {
  main: HTMLElement;
  progressMeter: HTMLSpanElement;

  state: State = {
    loaded: false,
    locale: '',
    locales: null,
    messagesGenerator: null,
  };

  /**
   * App will handle routing to page controllers.
   */
  constructor(props: any, context: any) {
    super(props, context);

    if (isNativeIOS()) {
      this.bootstrapIOS();
    }

    if (isFocus()) {
      document.body.classList.add('focus');
    }

    if (isMobileWebkit()) {
      document.body.classList.add('mobile-safari');
    }

    if (location.origin !== 'https://voice.mozilla.org') {
      fetch('https://pontoon.mozilla.org/graphql', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          query: `{
            project(slug: "common-voice") {
              localizations {
                locale {
                 code
                 name
                }
              }
            }
          }`,
          variables: null,
        }),
      })
        .then(response => response.json())
        .then(({ data }) => this.setLocales(data));
    }
  }

  private async setLocales(pontoonData: any) {
    const locales = pontoonData.project.localizations
      .map(({ locale }: any) => [locale.code, locale.name])
      .reduce((obj: any, [code, name]: any) => ({ ...obj, [code]: name }), {});

    this.setState({
      messagesGenerator: await createMessagesGenerator(
        this.props.api,
        navigator.languages,
        Object.keys(locales)
      ),
      locales,
    });
  }

  /**
   * Pre-Load all images before first content render.
   */
  private preloadImages(
    progressCallback?: (percentLoaded: number) => void
  ): Promise<void> {
    return new Promise<void>(resolve => {
      let loadedSoFar = 0;
      const onLoad = () => {
        ++loadedSoFar;
        if (loadedSoFar === PRELOAD.length) {
          resolve();
          return;
        }

        if (progressCallback) {
          progressCallback(loadedSoFar / PRELOAD.length);
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
    await Promise.all([
      new Promise(async resolve => {
        this.setState({
          messagesGenerator: await createMessagesGenerator(
            this.props.api,
            navigator.languages
          ),
        });
        resolve();
      }),
      Promise.race([
        sleep(LOAD_TIMEOUT),
        this.preloadImages((progress: number) => {
          if (this.progressMeter) {
            // TODO: find something performant here. (ie not this)
            // let whatsLeft = 1 - progress;
            // this.progressMeter.style.cssText =
            //   `transform: scale(${whatsLeft});`;
          }
        }),
      ]).then(() => this.setState({ loaded: true })),
    ]);
  }

  private handleLocaleChange = async ({ target: { value: locale } }: any) => {
    this.setState({
      locale,
      messagesGenerator: await createMessagesGenerator(
        this.props.api,
        [locale],
        Object.keys(this.state.locales)
      ),
    });
  };

  render() {
    const { loaded, locale, locales, messagesGenerator } = this.state;
    return loaded && messagesGenerator ? (
      <div>
        {locales && (
          <select value={locale} onChange={this.handleLocaleChange}>
            <option value="">Select a Language...</option>
            {Object.entries(locales).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        )}
        <LocalizationProvider messages={messagesGenerator()}>
          <Router>
            <Pages />
          </Router>
        </LocalizationProvider>
      </div>
    ) : (
      <div id="spinner">
        <span
          ref={el => {
            if (this.progressMeter) {
              return;
            }

            this.progressMeter = el as HTMLSpanElement;
          }}
        />
      </div>
    );
  }
}

const AppWithStore = connect<PropsFromState>(({ api }: StateTree) => ({
  api,
}))(App);

export default (props: any) => (
  <Provider store={store}>
    <AppWithStore {...props} />
  </Provider>
);
