import Pages from './pages';

/**
 * Main app controller, rensponsible for routing between page
 * controllers.
 */
export default class App {

  // Allows controls of the different pages.
  pages: Pages;
  url: URL;

  /**
   * App will handle routing to page controllers.
   */
  constructor(public container: HTMLElement) {
    this.pages = new Pages();
  }

  private parseUrl(): URL {
    this.url = new URL(window.location.href);
    return this.url;
  }

  private getPageName(): string {
    let url = this.parseUrl();
    return url.pathname;
  }

  /**
   * Entry point for the application.
   */
  run(): void {

    // Listen and respond to any navigation requests.
    this.pages.on('nav', (page: string) => {
      window.history.pushState(null, '', page);
      this.route();
    });

    // Init the helper.
    this.pages.init().then(() => {
      this.route();
    });
  }

  route(): void {
    let name: string = this.getPageName();
    this.pages.route(name);
  }
}
