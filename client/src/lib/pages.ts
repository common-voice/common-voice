import Eventer from './eventer';
import Page from './pages/page';
import Record from './pages/record';
import Home from './pages/home';
import NotFound from './pages/not-found';

export default class Pages extends Eventer {

  public static PAGES = {
    ROOT: '/',
    HOME: '/home',
    RECORD: '/record',
    NOT_FOUND: '/notFound'
  }

  private pages: string[];
  private home: Home;
  private record: Record;
  private notFound: NotFound;

  private currentPage: Page<any>;

  constructor() {
    super();

    // Create a list of pages for quick validation later.
    this.pages = Object.keys(Pages.PAGES).map((key: string) => {
      return Pages.PAGES[key];
    });

    // These are the page controllers.
    this.home = new Home();
    this.record = new Record();
    this.notFound = new NotFound();
  }

  init() {
    // Forward nav events from any page controller onward.
    let navPageHandler = (page: string) => {
      this.trigger('nav', page);
    };

    this.home.init(navPageHandler);
    this.record.init(navPageHandler);
    this.notFound.init(navPageHandler);
  }

  /**
   * Get the appropriate page controller for current page
   */
  private getPageController(pageName: string): Page<any> {
    switch (pageName) {
      case '/':
      case '/home':
        return this.home;

      case '/record':
        return this.record;

      default:
        return this.notFound;
    }
  }

  public isValidPage(pageName: string): boolean {
    return (this.pages.indexOf(pageName) !== -1);
  }

  /**
   * Figure out which page to load.
   */
  route(name: string): void {
    let previousPage = this.currentPage;
    this.currentPage = this.getPageController(name);

    // If we are trying to navigate to the same page as before, do nothing.
    if (previousPage === this.currentPage) {
      return;
    }

    if(previousPage) {
      previousPage.hide();
    }

    this.currentPage.show();
  }
}
