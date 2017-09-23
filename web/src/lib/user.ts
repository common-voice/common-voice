import { generateGUID } from './utility';
import Tracker from './tracker';

const USER_KEY = 'userdata';

interface UserAccents {
  [key: string]: string;
  '': string;
  'us': string;
  'australia': string;
  'england': string;
  'canada': string;
  'philippines': string;
  'hongkong': string;
  'indian': string;
  'ireland': string;
  'malaysia': string;
  'newzealand': string;
  'scotland': string;
  'singapore': string;
  'southatlandtic': string;
  'african': string;
  'wales': string;
  'bermuda': string;
};

export const ACCENTS: UserAccents = {
  '': '--',
  'us': 'United States English',
  'australia': 'Australian English',
  'england': 'England English',
  'canada': 'Canadian English',
  'philippines': 'Filipino',
  'hongkong': 'Hong Kong English',
  'indian': 'India and South Asia (India, Pakistan, Sri Lanka)',
  'ireland': 'Irish English',
  'malaysia': 'Malaysian English',
  'newzealand': 'New Zealand English',
  'scotland': 'Scottish English',
  'singapore': 'Singaporean English',
  'southatlandtic': 'South Atlantic (Falkland Islands, Saint Helena)',
  'african': 'Southern African (South Africa, Zimbabwe, Namibia)',
  'wales': 'Welsh English',
  'bermuda': 'West Indies and Bermuda (Bahamas, Bermuda, Jamaica, Trinidad)',
};

interface UserAges {
  [key: string]: string;
  '': string;
  'teens': string;
  'twenties': string;
  'thirties': string;
  'fourties': string;
  'fifties': string;
  'sixties': string;
  'seventies': string;
  'eighties': string;
  'nineties': string;
};

export const AGES: UserAges = {
  '': '--',
  'teens': '< 19',
  'twenties': '19 - 29',
  'thirties': '30 - 39',
  'fourties': '40 - 49',
  'fifties': '50 - 59',
  'sixties': '60 - 69',
  'seventies': '70 - 79',
  'eighties': '80 - 89',
  'nineties': '> 89',
};

interface UserGender {
  [key: string]: string;
  '': '--',
  'male': 'Male',
  'female': 'Female',
  'other': 'Other'
};

export const GENDER: UserGender = {
  '': '--',
  'male': 'Male',
  'female': 'Female',
  'other': 'Other'
};

interface UserState {
  userId: string;
  email: string;
  sendEmails: boolean;
  accent: string;
  age: string;
  gender: string;
  clips: number;
  privacyAgreed: boolean;

  recordTally: number;
  validateTally: number;
}

/**
 * User tracking
 */
export default class User {

  state: UserState;
  tracker: Tracker;

  constructor() {
    this.tracker = new Tracker();
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
        age: '',
        gender: '',
        clips: 0,
        privacyAgreed: false,
        recordTally: 0,
        validateTally: 0
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
    this.tracker.trackGiveEmail();
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
    this.tracker.trackGiveAccent();
  }

  public setAge(age: string): void {
    if (!AGES[age]) {
      console.error('cannot set unrecognized age', age);
      return;
    }

    this.state.age = age;
    this.save();
    this.tracker.trackGiveAge();
  }

  public setGender(gender: string): void {
    if (!GENDER[gender]) {
      console.error('cannot set unrecognized gender', gender);
      return;
    }

    this.state.gender = gender;
    this.save();
    this.tracker.trackGiveGender();
  }

  public getState(): UserState {
    return this.state;
  }

  public hasAgreedToPrivacy() {
    return this.state.privacyAgreed;
  }

  public agreeToPrivacy() {
    this.state.privacyAgreed = true;
    this.save();
  }

  public tallyRecording() {
    this.state.recordTally = this.state.recordTally || 0;
    this.state.recordTally++
    this.save();
  }

  public tallyVerification() {
    this.state.validateTally = this.state.validateTally || 0;
    this.state.validateTally++
    this.save();
  }
}
