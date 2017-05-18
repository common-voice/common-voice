/**
 * Allows us to see console log on the ios app.
 */
export default class DebugBox {
  box: HTMLElement;

  constructor() {
    this.init();
  }

  private $(message: string): HTMLElement {
    let el = document.createElement('div');
    el.textContent = message;
    return el;
  }

  init(): void {
    this.box = this.$('');
    this.box.id = 'debug-box';
    document.body.appendChild(this.box);

    let log = window.console.log.bind(window.console);
    window.console.log = (...args) => {
      log(...args);
      this.box.appendChild(this.$(args.join(', ')));
    }
  }
}
