import Page from './page';

const CLASS_NAME = 'notFound';

export default class NotFoundPage extends Page {
  constructor() {
    super(CLASS_NAME, true);
  }

  init(navHandler: Function) {
    super.init(navHandler);
    this.content.innerHTML = 'Page not found.';
    return null;
  }
}
