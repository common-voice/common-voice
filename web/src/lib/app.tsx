import * as React from 'react';
import User from './user';
import API from './api';
import Pages from './components/pages';
import { isMobileWebkit, isFocus, isNativeIOS, sleep } from './utility';
import { BrowserRouter as Router } from 'react-router-dom';

const LOAD_DELAY = 500; // before pulling the curtain

/**
 * Preload these images before revealing contents.
 * TODO: right now we load all images, which is unnecessary.
 */
const PRELOAD = [
  '/img/cv-logo-bw.svg',
  '/img/cv-logo-one-color-white.svg',
  '/img/robot-greetings.png',
  '/img/robot-listening.png',
  '/img/robot-thanks.png',
  '/img/robot-thinking.png',
  '/img/robot-thumbs-up.png',
  '/img/speech-bubble.png',
  '/img/strip-repeat.png',
  '/img/strip-top.png',
  '/img/wave-blue-large.png',
  '/img/wave-blue-mobile.png',
  '/img/wave-red-large.png',
  '/img/wave-red-mobile.png',
  '/img/circle.png',
];

interface State {
  loaded: boolean;
}

export default class App extends React.Component<{}, State> {
  user: User;
  api: API;
  main: HTMLElement;
  progressMeter: HTMLSpanElement;

  state = { loaded: false };

  /**
   * App will handle routing to page controllers.
   */
  constructor() {
    super();

    if (isNativeIOS()) {
      this.bootstrapIOS();
    }

    if (isFocus()) {
      document.body.classList.add('focus');
    }

    if (isMobileWebkit()) {
      document.body.classList.add('mobile-safari');
    }

    this.user = new User();
    this.api = new API(this.user);
    this.api.syncUser();

    this.user.onUpdate(this.handleUserUpdate.bind(this));
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

  private handleUserUpdate(): void {
    this.api.syncUser();
  }

  /**
   * Perform any native iOS specific operations.
   */
  private bootstrapIOS() {
    document.body.classList.add('ios');
  }

  async componentDidMount() {
    await Promise.race([
      sleep(LOAD_DELAY),
      this.preloadImages((progress: number) => {
        if (this.progressMeter) {
          // TODO: find something performant here. (ie not this)
          // let whatsLeft = 1 - progress;
          // this.progressMeter.style.cssText =
          //   `transform: scale(${whatsLeft});`;
        }
      }),
    ]);

    this.setState({ loaded: true });
  }

  render() {
    const loaded = this.state.loaded;
    return (
      <div>
        {loaded ? (
          <Router>
            <Pages
              user={this.user}
              api={this.api}
              match={null}
              location={null}
              history={null}
            />
          </Router>
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
        )}
      </div>
    );
  }
}
