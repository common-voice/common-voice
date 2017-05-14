import Eventer from './eventer';
import Record from './pages/record';
import Home from './pages/home';
import NotFound from './pages/not-found';

export default class Pages extends Eventer {

  public home: Home;
  public record: Record;
  public notFound: NotFound;

  constructor() {
    super();
    this.home = new Home();
    this.record = new Record();
    this.notFound = new NotFound();
  }

  init() {
    let navPageHandler = this.handlePageNav.bind(this);
    return Promise.all([
      this.home.init(navPageHandler),
      this.record.init(navPageHandler),
      this.notFound.init(navPageHandler),
    ]);
  }

  handlePageNav(page) {
    this.trigger('nav', page);
  }
}
