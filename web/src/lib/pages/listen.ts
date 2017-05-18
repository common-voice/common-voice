import Page from './page';
import User from '../user';

const PAGE_NAME = 'listen'

export default class ListenPage extends Page<void> {

  name: string = PAGE_NAME;
  audio: HTMLAudioElement;
  sentence: HTMLElement;

  constructor(user: User) {
    super(user, PAGE_NAME);
  }

  init(navHandler: Function) {
    super.init(navHandler);

    this.content.innerHTML = `
    <audio id="listen-audio" controls="controls"></audio>
    <p id="listen-sentence"></p>
    <form>
      <label class="validate-lbl" for="yes-validate">
        <input id="yes-validate" type="radio" name="validate" value="yes" />
        Yes
      </label>
      <label class="validate-lbl" for="no-validate">
        <input id="no-validate" type="radio" name="validate" value="no" />
        No
      </label>
      <button id="listen-submit" type="submit">Submit</button>
    </form>`;

    let $ = this.content.querySelector.bind(this.content);
    this.audio = $('#listen-audio');
    this.sentence = $('#listen-sentence');

    this.audio.addEventListener('ended', function() {
      console.log('audio played');
    });

    // Ask the server for some random clip to verify.
    this.api.getRandomClip().then((clip: any[2]) => {
      let sentence = clip[1];
      this.sentence.textContent = sentence;
      this.audio.onerror = (err: ErrorEvent) => {
        console.error('yup, audio loading failed', err);
      }
      this.audio.src = clip[0];
    });
  }
}
