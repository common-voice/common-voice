import { h, render } from 'preact';
import User from './user';
import API from './api';
import Pages from './components/pages';
import { isNativeIOS } from './utility';
import DebugBox from './components/debug-box';

const LOAD_DELAY = 500; // before pulling the curtain

/**
 * Preload these images before revealing contents.
 * TODO: right now we load all images, which is unnecessary.
 */
const PRELOAD = [
  '/img/mozilla.svg',
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
  '/img/wave-red-mobile.png'
];

/**
 * Main app controller, rensponsible for routing between page
 * controllers.
 */
export default class App {

  box: DebugBox;
  user: User;
  api: API;
  loaded: boolean;
  loadProgress: number;
  progressMeter: HTMLSpanElement;

  /**
   * App will handle routing to page controllers.
   */
  constructor() {
    // Disable the debug box for now.
    if (isNativeIOS()) {
      this.bootstrapIOS();
    }

    this.user = new User();
    this.api = new API(this.user);
    this.loaded = false;

    // Force binding of handleNavigation to this instance.
    this.handleNavigation = this.handleNavigation.bind(this);

    // Render before loaded.
    this.renderCurrentPage();
  }

  private loadImages(progressCallback?: Function): Promise<void> {
    return new Promise<void>((res, rej) => {
      let loadedSoFar = 0;
      let onLoad = () => {
        ++loadedSoFar;
        if (loadedSoFar === PRELOAD.length) {
          res();
          return;
        }

        progressCallback(loadedSoFar / PRELOAD.length);

      };
      for (let i = 0; i < PRELOAD.length; i++) {
        let image = new Image();
        image.onload = onLoad;
        image.src = PRELOAD[i];
      }
    });
  }

  /**
   * LOAD ALL IMAGES BEFORE FIRST RENDER
   * */

  /**
   * Perform any native iOS specific operations.
   */
  private bootstrapIOS() {
    document.body.classList.add('ios');
    this.renderDebugBox();
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
    return link.pathname;
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

  private renderCurrentPage() {
    if (!this.loaded) {
      render(
        <div id="spinner">
          <span ref={(el) => {
            if (this.progressMeter) {
              return;
            }

            this.progressMeter = el as HTMLSpanElement; }} />
        </div>, document.body, document.body.firstElementChild);
      return;
    }

    // Render the main controller, Pages.
    render((
      <Pages user={this.user}
             api={this.api}
             navigate={this.handleNavigation}
             currentPage={this.getPageName()} />
    ), document.body, document.body.firstElementChild);
  }

  init(): Promise<void> {
    return this.loadImages(progress => {
      if (this.progressMeter) {
        // TODO: find something performant here. (ie not this)
        // let whatsLeft = 1 - progress;
        // this.progressMeter.style.cssText =
        //   `transform: scale(${whatsLeft});`;
      }
    }).then(() => {
      this.loaded = true;
      setTimeout(() => {
        document.body.classList.add('loaded');
      }, LOAD_DELAY);
    });
  }

  /**
   * Entry point for the application.
   */
  run(): void {
    this.renderCurrentPage();
  }
}
