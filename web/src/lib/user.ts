import { generateGUID } from './utility';

const USER_KEY = 'userdata';

interface UserState {
  userId: string;
  email: string;
  sendEmails: boolean;
  clips: number;
}

/**
 * User tracking
 */
export default class User {

  state: UserState;

  constructor() {
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
      this.state = {
        userId: generateGUID(),
        email: '',
        sendEmails: false,
        clips: 0
      };
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

  public setEmail(email: string): void {
    this.state.email = email;
    this.store();
  }

  public setSendEmails(value: boolean): void {
    this.state.sendEmails = value;
    this.store();
  }

  public getState(): UserState {
    return this.state;
  }
}
