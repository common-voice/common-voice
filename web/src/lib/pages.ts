import Eventer from './eventer';
import User from './user';
import Page from './pages/page';
import Record from './pages/record';
import Listen from './pages/listen';
import Home from './pages/home';
import About from './pages/about';
import NotFound from './pages/not-found';
import HamburgerMenu from './hamburger-menu';

export default class Pages extends Eventer {

  public static PAGES = {
    ROOT: '/',
    HOME: '/home',
    RECORD: '/record',
    LISTEN: '/listen',
    ABOUT: '/about',
    NOT_FOUND: '/notFound'
  }

  private pages: string[];
  private home: Home;
  private record: Record;
  private listen: Listen;
  private about: About;
  private notFound: NotFound;

  private currentPage: Page<any>;

  private hamburgerMenu: HamburgerMenu;

  constructor(public user: User) {
    super();

    // Create a list of pages for quick validation later.
    this.pages = Object.keys(Pages.PAGES).map((key: string) => {
      return Pages.PAGES[key];
    });

    // These are the page controllers.
    this.home = new Home(user);
    this.about = new About(user);
    this.record = new Record(user);
    this.listen = new Listen(user);
    this.notFound = new NotFound(user);

    this.hamburgerMenu = new HamburgerMenu({
      button: document.getElementById('hamburger-menu'),
      modal: document.getElementById('navigation-modal')
    });
  }

  init() {
    // Forward nav events from any page controller onward.
    let navPageHandler = (page: string) => {
      this.trigger('nav', page);
    };

    this.home.init(navPageHandler);
    this.record.init(navPageHandler);
    this.listen.init(navPageHandler);
    this.about.init(navPageHandler);
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

      case '/listen':
        return this.listen;

      case '/about':
        return this.about;

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

    this.hamburgerMenu.setActive(false);
  }
}
