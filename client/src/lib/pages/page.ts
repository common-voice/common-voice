import Eventer from '../eventer';

/**
 * Represents a single page. Automatically highights
 * navigation when page active and removes content
 * when page navigates away.
 */
export default abstract class Page<State> extends Eventer {

  state: State = Object.create(null);
  name: string;
  updateTimeout: number;
  nav: HTMLAnchorElement;
  content: HTMLDivElement;
  container: HTMLElement;

  /**
   * Create a page object
   *   @name - the name of the page
   *   @noNav - do we want a main navigation item for this page?
   */
  constructor(name: string, public noNav?: boolean) {
    super();
    this.container = document.getElementById('content');
    this.content = document.createElement('div');

    // Some pages (like 404) will not need a navigation tab.
    if (!noNav) {
      this.nav = document.createElement('a');
      this.nav.href = '/' + name;
      this.nav.textContent = name;
      document.querySelector('#main-nav').appendChild(this.nav);
      this.nav.addEventListener('click', (evt: MouseEvent) => {
        evt.preventDefault();
        evt.stopPropagation();
        this.trigger('nav', this.nav.href);
      }, true);
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

  setState(state: State) {
    let needsUpdating = false;
    for (let k in state) {
      if (this.state[k] != state[k]) {
        this.state[k] = state[k];
        needsUpdating = true;
      }
    }
    if (needsUpdating) {
      this.forceUpdate();
    }
  }

  forceUpdate() {
    if (this.updateTimeout) {
      return;
    }
    this.updateTimeout = setTimeout(() => {
      this.update();
      this.updateTimeout = 0;
    });
  }

  /**
   * Called whenever page state has changed (debounced).
   */
  update() {}

  show(): void {
    if (!this.noNav) {
      this.nav.classList.add('active');
    }

    this.content.classList.add('active');
    if (!this.content.parentNode) {
      this.container.appendChild(this.content);
    }
  }

  hide(): void {
    if (!this.noNav) {
      this.nav.classList.remove('active');
    }

    this.content.classList.remove('active');
  }
}
