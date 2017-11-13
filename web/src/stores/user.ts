import pick = require('lodash.pick');
import { createSelector } from 'reselect';
import { generateGUID } from '../utility';

export const ACCENTS = {
  '': '--',
  us: 'United States English',
  australia: 'Australian English',
  england: 'England English',
  canada: 'Canadian English',
  philippines: 'Filipino',
  hongkong: 'Hong Kong English',
  indian: 'India and South Asia (India, Pakistan, Sri Lanka)',
  ireland: 'Irish English',
  malaysia: 'Malaysian English',
  newzealand: 'New Zealand English',
  scotland: 'Scottish English',
  singapore: 'Singaporean English',
  southatlandtic: 'South Atlantic (Falkland Islands, Saint Helena)',
  african: 'Southern African (South Africa, Zimbabwe, Namibia)',
  wales: 'Welsh English',
  bermuda: 'West Indies and Bermuda (Bahamas, Bermuda, Jamaica, Trinidad)',
};

export const AGES = {
  '': '',
  teens: '< 19',
  twenties: '19 - 29',
  thirties: '30 - 39',
  fourties: '40 - 49',
  fifties: '50 - 59',
  sixties: '60 - 69',
  seventies: '70 - 79',
  eighties: '80 - 89',
  nineties: '> 89',
};

export const GENDERS = {
  '': '',
  male: 'Male',
  female: 'Female',
  other: 'Other',
};

export interface UserState {
  userId: string;
  email: string;
  username: string;
  sendEmails: boolean;
  accent: keyof typeof ACCENTS;
  age: keyof typeof AGES;
  gender: keyof typeof GENDERS;
  clips: number;
  privacyAgreed: boolean;

  recordTally: number;
  validateTally: number;
}

interface UpdatableState {
  email?: string;
  username?: string;
  sendEmails?: boolean;
  accent?: string;
  age?: string;
  gender?: string;
  privacyAgreed?: boolean;
}

function getDefaultState(): UserState {
  return {
    userId: generateGUID(),
    email: '',
    username: '',
    sendEmails: false,
    accent: '',
    age: '',
    gender: '',
    clips: 0,
    privacyAgreed: false,
    recordTally: 0,
    validateTally: 0,
  };
}

enum ActionType {
  UPDATE = 'UPDATE_USER',
  TALLY_RECORDING = 'TALLY_RECORDING',
  TALLY_VERIFICATION = 'TALLY_VERIFICATION',
}

interface UpdateAction {
  type: ActionType.UPDATE;
  state: UpdatableState;
}

interface TallyRecordingAction {
  type: ActionType.TALLY_RECORDING;
}

interface TallyVerificationAction {
  type: ActionType.TALLY_VERIFICATION;
}

type Action = UpdateAction | TallyRecordingAction | TallyVerificationAction;

export const actions = {
  update: (state: UpdatableState): UpdateAction => {
    return {
      type: ActionType.UPDATE,
      state,
    };
  },

  tallyRecording: (): TallyRecordingAction => ({
    type: ActionType.TALLY_RECORDING,
  }),

  tallyVerification: (): TallyVerificationAction => ({
    type: ActionType.TALLY_VERIFICATION,
  }),

  clear: (): UpdateAction => ({
    type: ActionType.UPDATE,
    state: getDefaultState(),
  }),
};

export default function reducer(state = getDefaultState(), action: Action) {
  switch (action.type) {
    case ActionType.UPDATE:
      return { ...state, ...action.state };

    case ActionType.TALLY_RECORDING:
      return { ...state, recordTally: state.recordTally + 1 };

    case ActionType.TALLY_VERIFICATION:
      return { ...state, validateTally: state.validateTally + 1 };

    default:
      return state;
  }
}

export const hasEnteredInfoSelector = createSelector(
  state => pick(state, 'email', 'username', 'accent', 'age', 'gender'),
  (state: any) => Object.keys(state).some(k => Boolean(state[k]))
);
