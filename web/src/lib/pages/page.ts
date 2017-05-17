import Component from '../component';
import User from '../user';
import { capitalizeFirstLetter, jsifyLink } from '../utility';

/**
 * Represents a single page. Automatically highights
 * navigation when page active and removes content
 * when page navigates away.
 */
export default abstract class Page<State> extends Component<State> {
  name: string;
  nav: HTMLAnchorElement;
  content: HTMLElement;
  container: HTMLElement;

  /**
   * Create a page object
   *   @name - the name of the page
   *   @noNav - do we want a main navigation item for this page?
   */
  constructor(public user: User, name: string, public noNav?: boolean) {
    super();
    this.container = document.getElementById('content');
    this.content = document.createElement('div');
    this.content.className = 'container';

    // Some pages (like 404) will not need a navigation tab.
    if (!noNav) {
      this.nav = document.createElement('a');
      this.nav.id = name;
      this.nav.className = 'tab';
      this.nav.href = '/' + name;
      this.nav.textContent = capitalizeFirstLetter(name);
      document.querySelector('#main-nav').appendChild(this.nav);
      jsifyLink(this.nav, this.trigger.bind(this, 'nav'));
    }
  }

  /**
   * init function must be defined by any page object
   * to set up the nav element and content.
   */
  init(navHandler: Function) {
    this.on('nav', navHandler);
    return null;
  }
  /**
   * Show this page using css.
   */
  show(): void {
    if (!this.noNav) {
      this.nav.classList.add('active');
    }

    this.content.classList.add('active');
    if (!this.content.parentNode) {
      this.container.appendChild(this.content);
    }
  }

  /**
   * Hide this page using css.
   */
  hide(): void {
    if (!this.noNav) {
      this.nav.classList.remove('active');
    }

    this.content.classList.remove('active');
  }
}
