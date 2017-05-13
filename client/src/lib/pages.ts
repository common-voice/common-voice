import Record from './../pages/record';
import Home from './../pages/home';

export default class Pages {

  public home: Home;
  public record: Record;

  constructor() {
    this.home = new Home();
    this.record = new Record();
  }

  init() {
    return Promise.all([
      this.home.init(),
      this.record.init()
    ]);
  }
}
