import Component from './component';
import { generateGUID } from './utility';

const USER_KEY = 'userdata';

interface UserState {
  userId: string;
  clips: number;
}

/**
 * User tracking
 */
export default class User extends Component<UserState> {

  // Store userid on this object.
  constructor() {
    super();
    this.restore();
  }

  private restore(): void {
    try {
      this.state = JSON.parse(this.getStore());
    } catch (e) {
      console.error('failed parsing storage', e);
      localStorage.removeItem(USER_KEY);
      this.state = null;
    }

    if (!this.state) {
      this.state = Object.create(null);
      this.setState({
        userId: generateGUID(),
        clips: 0
      });
      this.store();
    }
  }

  private getStore(): string {
    return localStorage && localStorage.getItem(USER_KEY);
  }

  private store(): void {
    localStorage && (localStorage[USER_KEY] = JSON.stringify(this.state));
  }

  public getId(): string {
    return this.state.userId;
  }
}
