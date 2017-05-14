import Page from './pages/page';
import Pages from './pages';

export default class App {

  pages: Pages;
  currentPage: Page;

  /**
   * App will handle routing to page controllers.
   */
  constructor(public container: HTMLElement) {
    this.pages = new Pages();
  }

  /**
   * Get the appropriate page controller for current page
   */
  private getPageController(): Page {
    let url = new URL(window.location.href);
    let page = url.pathname;

    switch (page) {
      case '/':
      case '/home':
        return this.pages.home;

      case '/record':
        return this.pages.record;

      default:
        return this.pages.notFound;
    }
  }

  /**
   * Entry point for the application.
   */
  run(): void {
    this.pages.on('nav', (page: string) => {
      history.pushState(null, '', page);
      this.route();
    });

    this.pages.init().then(() => {
      this.route();
    });
  }

  /**
   * Figure out wich page to load.
   */
  route(): void {
    let previousPage = this.currentPage;
    this.currentPage = this.getPageController();

    if (previousPage === this.currentPage) {
      return;
    }

    if(previousPage) {
      previousPage.hide();
    }

    this.currentPage.show();
  }
}
