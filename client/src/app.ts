import API from './api';

export default class App {
  api: API;

  /**
   * App will handle routing to page controllers.
   */
  constructor(public container: HTMLElement) {
    this.api = new API();
  }


  /**
   * Entry point for the application.
   */
  run() {
    this.container.innerHTML = 'Loading...';
    this.api.getSentence().then(sentence => {
      this.container.innerHTML = sentence;
    });
  }
}
