interface HamburgerMenuOptions {
  button: HTMLElement;
  modal: HTMLElement;
}

/**
 * A hamburger menu button that toggles the display of a modal panel.
 */
export default class HamburgerMenu {
  private isActive: boolean;
  private options: HamburgerMenuOptions;

  constructor(options: HamburgerMenuOptions) {
    this.options = options;
    this.options.button.addEventListener('click', this.toggle);
  }

  toggle = () => {
    this.setActive(!this.isActive);
  }

  setActive = (active: boolean) => {
    this.isActive = active;
    document.body.classList.toggle('hamburger-menu-is-active', this.isActive);
    this.options.button.classList.toggle('is-active', this.isActive);
    this.options.modal.classList.toggle('is-active', this.isActive);
  }
}
