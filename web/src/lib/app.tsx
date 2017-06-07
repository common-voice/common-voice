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

  box: DebugBox;
  user: User;

  /**
   * App will handle routing to page controllers.
   */
  constructor() {
    if (isNativeIOS()) {
      this.bootstrapIOS();
    }

    this.user = new User();
    document.body.classList.add('loaded');

    // Force binding of handleNavigation to this instance.
    this.handleNavigation = this.handleNavigation.bind(this);
  }

  /**
   * Perform any native iOS specific operations.
   */
  private bootstrapIOS() {
    // For styling fixes on ios.
    document.body.classList.add('ios');

    // Put up the debug box in ios app for now.
    this.box = new DebugBox();
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

  private renderCurrentPage() {
    // Render the main controller, Pages.
    render((
      <Pages user={this.user}
             navigate={this.handleNavigation}
             currentPage={this.getPageName()} />
    ), document.body, document.body.lastChild as Element);
  }

  /**
   * Entry point for the application.
   */
  run(): void {
    this.renderCurrentPage();
  }
}
