import { generateGUID } from './utility';

const USER_KEY = 'userdata';

export const ACCENTS = {
  'us': 'United States',
  'england': 'England',
  'scotland': 'Scotland',
  'wales': 'Wales',
  'ireland': 'Ireland',
  'canada': 'Canada',
  'bermuda': 'West Indies and Bermuda (Bahamas, Bermuda, Jamaica, Trinidad)',
  'australia': 'Australia',
  'newzealand': 'New Zealand',
  'southatlandtic': 'South Atlantic (Falkland Islands, Saint Helena)',
  'african': 'Southern Africa (South Africa, Zimbabwe, Namibia)',
  'philippines': 'Philippines',
  'hongkong': 'Hong Kong',
  'malaysia': 'Malaysia',
  'singapore': 'Singapore',
};

interface UserState {
  userId: string;
  email: string;
  sendEmails: boolean;
  accent: string;
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
        accent: '',
        clips: 0
      };
      this.save();
    }
  }

  private getStore(): string {
    return localStorage && localStorage.getItem(USER_KEY);
  }

  private save(): void {
    localStorage && (localStorage[USER_KEY] = JSON.stringify(this.state));
  }

  public getId(): string {
    return this.state.userId;
  }

  public setEmail(email: string): void {
    this.state.email = email;
    this.save();
  }

  public setSendEmails(value: boolean): void {
    this.state.sendEmails = value;
    this.save();
  }

  public setAccent(accent: string): void {
    if (!ACCENTS[accent]) {
      console.error('cannot set unrecognized accent', accent);
      return;
    }

    this.state.accent = accent;
    this.save();
  }

  public getState(): UserState {
    return this.state;
  }
}
