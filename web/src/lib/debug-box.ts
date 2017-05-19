/**
 * Allows us to see console log on the ios app.
 */
export default class DebugBox {
  box: HTMLElement;

  constructor() {
    this.init();

    // Add top level error handler.
    // Perhaps this should be moved into App?
    window.onerror = (err) => {
      console.log('got a top level error', err);
    };
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

    let err = window.console.error.bind(window.console);
    window.console.error = (...args) => {
      err(...args);
      this.box.appendChild(this.$(args.join(', ')));
    }
  }
}
