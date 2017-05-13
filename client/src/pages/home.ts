import Page from './../lib/page';

const CLASS_NAME = 'home';

export default class HomePage extends Page {
  constructor() {
    super(CLASS_NAME);
  }

  init() {
    this.content.innerHTML = 'Welcome to Common Voice';
    return null;
  }
}
