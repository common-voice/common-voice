/**
 * Represents a single page. Automatically highights
 * navigation when page active and removes content
 * when page navigates away.
 */
export default abstract class Page {
  nav: HTMLAnchorElement;
  content: HTMLDivElement;
  container: HTMLElement;

  /**
   * Create a page object
   *   @name - the name of the page
   *   @noNav - do we want a main navigation item for this page?
   */
  constructor(public name: string, public noNav?: boolean) {
    this.container = document.getElementById('content');
    this.content = document.createElement('div');
    if (!noNav) {
      this.nav = document.createElement('a');
      this.nav.href = name;
      this.nav.textContent = name;
      document.querySelector('#main-nav').appendChild(this.nav);
    }
  }

  /**
   * init function must be defined by any page object
   * to set up the nav element and content.
   */
  abstract init?(): Promise<void>;

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
