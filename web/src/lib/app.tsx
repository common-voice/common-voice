import { h, render } from 'preact';
import User from './user';
import API from './api';
import Pages from './components/pages';
import { isNativeIOS } from './utility';
import DebugBox from './components/debug-box';

/**
 * Main app controller, rensponsible for routing between page
 * controllers.
 */
export default class App {

  box: DebugBox;
  user: User;
  api: API;

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
    document.body.classList.add('loaded');

    // Force binding of handleNavigation to this instance.
    this.handleNavigation = this.handleNavigation.bind(this);
  }

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
    // Render the main controller, Pages.
    render((
      <Pages user={this.user}
             api={this.api}
             navigate={this.handleNavigation}
             currentPage={this.getPageName()} />
    ), document.body, document.body.firstElementChild);
  }

  /**
   * Entry point for the application.
   */
  run(): void {
    this.renderCurrentPage();
  }
}
