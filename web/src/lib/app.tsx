import { h, render } from 'preact';
import User from './user';
import Pages from './pages';
import { isNativeIOS } from './utility';
import DebugBox from './debug-box';

/**
 * Main app controller, rensponsible for routing between page
 * controllers.
 */
export default class App {

  // Allows controls of the different pages.
  box: DebugBox;
  pages: Pages;
  user: User;

  /**
   * App will handle routing to page controllers.
   */
  constructor() {
    if (isNativeIOS()) {
      // Put up the debug box in ios app for now.
      this.box = new DebugBox();

      // For styling fixes on ios.
      document.body.classList.add('ios');
    }

    this.user = new User();
    this.signalLoading();
  }

  /**
   * Inform user that page is loading.
   */
  private signalLoading(): void {
    document.body.classList.remove('loaded');
    document.body.classList.add('loading');
  }

  /**
   * Inform user that page has loaded.
   */
  private signalLoaded(): void {
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
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
    // Update the url history and inform apprioriate controller.
    window.history.pushState(null, '', page);
    this.route();
  }

  /**
   * Entry point for the application.
   */
  run(): void {
    // We'll need a bound navigation handler both now and later.
    let handler = this.handleNavigation.bind(this);

    // Listen and respond to any navigation requests.
    //this.pages.on('nav', handler);

    this.signalLoaded();
    handler();
  }

  /**
   * Give our page contoller the right page name.
   */
  route(): void {
    let name: string = this.getPageName();
    let root = document.getElementById('pages');
    render(<Pages user={this.user} navigate={this.handleNavigation.bind(this)} currentPage={name} />, root, root.firstElementChild);
  }
}
