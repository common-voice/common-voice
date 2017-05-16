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
  storage: any;

  // Store userid on this object.
  constructor() {
    super();
    this.storage = localStorage || {};
    this.state = this.restore();
  }

  private restore(): UserState {
    let state: UserState = this.storage[USER_KEY];

    if (!state) {
      state = {
        userId: generateGUID(),
        clips: 0
      };
      this.storage[USER_KEY] = state;
    }

    return state;
  }

  private store(): void {
    this.storage[USER_KEY] =  this.state;
  }

  public getId(): string {
    return this.state.userId;
  }
}
