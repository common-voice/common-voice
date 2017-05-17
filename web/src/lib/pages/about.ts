import Page from './page';
import User from '../user';

const PAGE_NAME = 'about';

export default class About extends Page<void> {
  name: string = PAGE_NAME;

  constructor(user: User) {
    super(user, PAGE_NAME);
  }

  init(navHandler: Function) {
    super.init(navHandler);
    this.content.innerHTML = 'About us.';
  }
}
