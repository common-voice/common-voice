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
    let voiceButton = document.createElement('button');
    voiceButton.textContent = 'Record Voice';
    voiceButton.onclick = () => {
      record();
    };

    this.container.appendChild(voiceButton);
  }
}
