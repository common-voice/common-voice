import Record from './pages/record';
import Home from './pages/home';
import NotFound from './pages/not-found';

export default class Pages {

  public home: Home;
  public record: Record;
  public notFound: NotFound;

  constructor() {
    this.home = new Home();
    this.record = new Record();
    this.notFound = new NotFound();
  }

  init() {
    return Promise.all([
      this.home.init(),
      this.record.init(),
      this.notFound.init(),
    ]);
  }
}
