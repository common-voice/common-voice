import Page from './page';
import User from '../user';

const PAGE_NAME = 'home'

export default class HomePage extends Page<void> {
  name: string = PAGE_NAME;

  constructor(user: User) {
    super(user, PAGE_NAME, true); // Don't need a nav item since we have logo.
  }

  init(navHandler: Function) {
    super.init(navHandler);
    this.content.innerHTML = 'Welcome to Common Voice';
  }
}
