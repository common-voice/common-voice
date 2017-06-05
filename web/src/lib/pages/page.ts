import Component from '../component';
import User from '../user';
import { capitalizeFirstLetter, jsifyLink } from '../utility';
import API from '../api';

/**
 * Represents a single page. Automatically highights
 * navigation when page active and removes content
 * when page navigates away.
 */
export default abstract class Page<State> extends Component<State> {
  name: string;
  api: API;
  private navElements: HTMLAnchorElement[] = [];
  content: HTMLElement;
  container: HTMLElement;

  /**
   * Create a page object
   *   @name - the name of the page
   *   @noNav - do we want a main navigation item for this page?
   */
  constructor(public user: User, name: string, public noNav?: boolean) {
    super();
    this.api = new API();

    // TODO: Fix this nonsense flipping between content and container names.
    this.container = document.getElementById('content');
    this.content = document.createElement('div');
    this.content.id = name + '-container';
    this.content.className = 'container';

    // Some pages (like 404) will not need a navigation tab.
    if (!noNav) {
      for (let list of Array.from(document.querySelectorAll('.nav-list'))) {
        let nav = document.createElement('a');
        nav.id = name;
        nav.className = 'tab';
        nav.href = '/' + name;
        nav.textContent = capitalizeFirstLetter(name);
        this.navElements.push(nav);
        jsifyLink(nav, this.trigger.bind(this, 'nav'));
        list.appendChild(nav);
      }
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
      this.navElements.forEach(el => el.classList.add('active'));
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
      this.navElements.forEach(el => el.classList.remove('active'));
    }

    this.content.classList.remove('active');
  }
}
