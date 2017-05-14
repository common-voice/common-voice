import Page from './page';

const CLASS_NAME = 'notFound';

export default class NotFoundPage extends Page {
  constructor() {
    super(CLASS_NAME, true);
  }

  init() {
    this.content.innerHTML = 'Page not found.';
    return null;
  }
}
