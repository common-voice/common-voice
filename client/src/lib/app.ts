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
    // For now, we will just show recording screen.
    this.pages.record();
  }
}
