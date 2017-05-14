import Pages from './pages';

/**
 * Main app controller, rensponsible for routing between page
 * controllers.
 */
export default class App {

  // Allows controls of the different pages.
  pages: Pages;

  /**
   * App will handle routing to page controllers.
   */
  constructor(public container: HTMLElement) {
    this.pages = new Pages();
  }

  private parseUrl(href?: string): URL {
    if (!href) {
      href = window.location.href;
    }
    return new URL(href);
  }

  private getPageName(href?: string): string {
    let url = this.parseUrl(href);
    return url.pathname;
  }

  private handleNavigation(href: string) {
    let page = this.getPageName(href);

    // If page is unrecognized, direct to 404 page.
    if (!this.pages.isValidPage(page)) {
      console.error('Page not found', page);
      page = Pages.PAGES.NOT_FOUND;
    }

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
    this.pages.on('nav', handler);

    // Init the page controllers.
    this.pages.init().then(handler);
  }

  /**
   * Give our page contoller the right page name.
   */
  route(): void {
    let name: string = this.getPageName();
    this.pages.route(name);
  }
}
