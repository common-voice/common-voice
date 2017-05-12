import record from './record';

export default class App {

  /**
   * App will handle routing to page controllers.
   */
  constructor(public container: HTMLElement) {
  }


  /**
   * Entry point for the application.
   */
  run() {
    // For now, we will just show recording screen.
    record();
  }
}
