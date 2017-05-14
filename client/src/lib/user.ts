import Component from './component';
import { generateGUID } from './utility';

const USER_KEY = '__userid';

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
    this.state = this.restore();
  }

  private restore(): UserState {
    let state: UserState = localStorage[USER_KEY];

    if (!state) {
      state = {
        userId: generateGUID(),
        clips: 0
      };
      localStorage[USER_KEY] = state;
    }

    return state;
  }

  private store(): void {
    localStorage[USER_KEY] =  this.state;
  }

  public getId(): string {
    return this.state.userId;
  }
}
