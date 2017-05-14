import Page from './page';

const PAGE_NAME = 'notFound';

export default class NotFoundPage extends Page<void> {
  name: string = PAGE_NAME;

  constructor() {
    super(PAGE_NAME, true);
  }

  init(navHandler: Function) {
    super.init(navHandler);
    this.content.innerHTML = 'Page not found.';
    return null;
  }
}
