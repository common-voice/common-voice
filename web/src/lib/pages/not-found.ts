import Page from './page';
import User from '../user';

const PAGE_NAME = 'notFound';

export default class NotFoundPage extends Page<void> {
  name: string = PAGE_NAME;

  constructor(user: User) {
    super(user, PAGE_NAME, true);
  }

  init(navHandler: Function) {
    super.init(navHandler);
    this.content.innerHTML = 'Page not found.';
  }
}
