import { h, render } from 'preact';
import User from './user';
import API from './api';
import Pages from './components/pages';
import { isMobileWebkit, isFocus, isNativeIOS, sleep } from './utility';
import DebugBox from './components/debug-box';

const LOAD_DELAY = 500; // before pulling the curtain
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

/**
 * Main app controller, rensponsible for routing between page controllers.
 */
export default class App {
  box: DebugBox;
  user: User;
  api: API;
  progressMeter: HTMLSpanElement;

  /**
   * App will handle routing to page controllers.
   */
  constructor() {
    // Disable the debug box for now.
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

    // Force binding of handleNavigation to this instance.
    this.handleNavigation = this.handleNavigation.bind(this);

    // Render loading spinner before loaded.
    this.renderSpinner();

    // React to external navigation (i.e. browser back/forward button)
    window.addEventListener('popstate', this.renderCurrentPage.bind(this));
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
    // this.renderDebugBox();
  }

  /**
   * Get the page name from the url.
   */
  private getPageName(href?: string): string {
    if (!href) {
      href = window.location.href;
    }
    let link = document.createElement('a');
    link.href = href;

    // Workaround for IE bug where pathname was not prefixed by '/'
    const pathname = link.pathname;
    if (pathname.indexOf('/') !== 0) {
      return '/' + pathname;
    }
    return pathname;
  }

  /**
   * Update the current page based on new url.
   */
  private handleNavigation(href: string) {
    let page = this.getPageName(href);
    window.history.pushState(null, '', page);
    this.renderCurrentPage();
  }

  private renderDebugBox() {
    render(<DebugBox />, document.body);
  }

  private renderSpinner() {
    render(
      <div id="spinner">
        <span
          ref={el => {
            if (this.progressMeter) {
              return;
            }

            this.progressMeter = el as HTMLSpanElement;
          }}
        />
      </div>,
      document.body,
      document.getElementById('spinner')
    );
  }

  private renderCurrentPage() {
    // Render the main controller, Pages.
    render(
      <Pages
        user={this.user}
        api={this.api}
        navigate={this.handleNavigation}
        currentPage={this.getPageName()}
      />,
      document.body,
      document.getElementById('main')
    );
  }

  async init(): Promise<void> {
    // Force page to be ready after a specified time, unless pre-loading images finishes first.
    await Promise.race([
      sleep(LOAD_TIMEOUT),
      this.preloadImages((progress: number) => {
        if (this.progressMeter) {
          // TODO: find something performant here. (ie not this)
          // let whatsLeft = 1 - progress;
          // this.progressMeter.style.cssText =
          //   `transform: scale(${whatsLeft});`;
        }
      }),
    ]);
  }

  /**
   * Entry point for the application.
   */
  async run(): Promise<void> {
    this.renderCurrentPage();

    await sleep(LOAD_DELAY);
    document.body.classList.add('loaded');

    const mainElement = document.getElementById('main');
    const transitionEndHandler = () => {
      document.body.removeChild(document.getElementById('spinner'));
      mainElement.removeEventListener('transitionend', transitionEndHandler);
    };
    mainElement.addEventListener('transitionend', transitionEndHandler);
  }
}
