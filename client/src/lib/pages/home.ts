import Page from './page';

const PAGE_NAME = 'home'

export default class HomePage extends Page<void> {
  name: string = PAGE_NAME;

  constructor() {
    super(PAGE_NAME);
  }

  init(navHandler: Function) {
    super.init(navHandler);
    this.content.innerHTML = 'Welcome to Common Voice';
    return null;
  }
}
