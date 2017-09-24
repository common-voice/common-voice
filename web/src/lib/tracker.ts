import { isProduction } from './utility';

declare var ga: any;

const CATEGORY_RECORD = 'Recording';
const CATEGORY_LISTEN = 'Listening';
const CATEGORY_PROFILE = 'Profile';

const ACTION_RECORD = 'record';
const ACTION_SUBMIT = 'submit';
const ACTION_LISTEN = 'listen';
const ACTION_VOTE_YES = 'vote-yes';
const ACTION_VOTE_NO = 'vote-no';
const ACTION_GIVE_EMAIL = 'give-email';
const ACTION_GIVE_ACCENT = 'give-accent';
const ACTION_GIVE_AGE = 'give-age';
const ACTION_GIVE_GENDER = 'give-gender';

/**
 * Event tracking.
 */
export default class Tracker {
  isProduction: boolean;

  constructor() {
    this.isProduction = isProduction();
  }

  private isLoaded() {
    return typeof ga === 'function';
  }

  private shouldTrack() {
    return this.isProduction && this.isLoaded();
  }

  private track(
    category: string,
    action: string,
    label?: string,
    value?: string
  ): void {
    if (!this.shouldTrack()) {
      return;
    }

    ga('send', 'event', category, action, label, value);
  }

  trackRecord() {
    this.track(CATEGORY_RECORD, ACTION_RECORD);
  }

  trackListen() {
    this.track(CATEGORY_LISTEN, ACTION_LISTEN);
  }

  trackSubmitRecordings() {
    this.track(CATEGORY_RECORD, ACTION_SUBMIT);
  }

  trackGiveEmail() {
    this.track(CATEGORY_PROFILE, ACTION_GIVE_EMAIL);
  }

  trackGiveAccent() {
    this.track(CATEGORY_PROFILE, ACTION_GIVE_ACCENT);
  }

  trackGiveAge() {
    this.track(CATEGORY_PROFILE, ACTION_GIVE_AGE);
  }

  trackGiveGender() {
    this.track(CATEGORY_PROFILE, ACTION_GIVE_GENDER);
  }

  trackVoteYes() {
    this.track(CATEGORY_LISTEN, ACTION_VOTE_YES);
  }

  trackVoteNo() {
    this.track(CATEGORY_LISTEN, ACTION_VOTE_NO);
  }
}
