import Pages from './pages';

export default class App {

  pages: Pages;

  /**
   * App will handle routing to page controllers.
   */
  constructor(public container: HTMLElement) {
    this.pages = new Pages();
  }

  /**
   * Entry point for the application.
   */
  run() {
    this.pages.init().then(() => {
      this.route();
    });
  }

  /**
   * Figure out wich page to load.
   */
  route() {
    let url = new URL(window.location.href);
    console.log('urrl', url.pathname);

    switch (url.pathname) {
      case '/':
      case '/home':
        this.pages.home.show();
        break;

      case '/record':
        this.pages.record.show();
        break;
    }
  }
}
