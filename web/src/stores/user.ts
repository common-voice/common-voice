import pick = require('lodash.pick');
import { createSelector } from 'reselect';
import { DEFAULT_LOCALE } from '../services/localization';
import { generateGUID } from '../utility';
import StateTree from './tree';

export const ACCENTS: any = {
  cy: {
    uk: 'United Kingdom',
  },
  de: {
    germany: 'Deutschland Deutsch',
    netherlands: 'Niederländisch Deutsch',
    austria: 'Österreichisches Deutsch',
    poland: 'Polnisch Deutsch',
    switzerland: 'Schweizerdeutsch',
    united_kingdom: 'Britisches Deutsch',
    france: 'Französisch Deutsch',
    denmark: 'Dänisch Deutsch',
    belgium: 'Belgisches Deutsch',
    hungary: 'Ungarisch Deutsch',
    brazil: 'Brasilianisches Deutsch',
    czechia: 'Tschechisch Deutsch',
    united_states: 'Amerikanisches Deutsch',
    slovakia: 'Slowakisch Deutsch',
    kazakhstan: 'Kasachisch Deutsch',
    italy: 'Italienisch Deutsch',
    finland: 'Finnisch Deutsch',
    slovenia: 'Slowenisch Deutsch',
    canada: 'Kanadisches Deutsch',
    bulgaria: 'Bulgarisch Deutsch',
    greece: 'Griechisch Deutsch',
    lithuania: 'Litauisch Deutsch',
    luxembourg: 'Luxemburgisches Deutsch',
    paraguay: 'Paraguayisch Deutsch',
    romania: 'Rumänisch Deutsch',
    liechtenstein: 'liechtensteinisches Deutscher',
    namibia: 'Namibisch Deutsch',
  },
  en: {
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
  },
  fr: {
    france: 'France français',
    madagascar: 'Madagascar français',
    cameroon: 'Cameroun français',
    germany: 'Allemand français',
    united_kingdom: 'United Kingdom',
    cote_d_ivoire: 'Côte d’Ivoire',
    tunisia: 'Tunisia',
    mali: 'Mali',
    algeria: 'Algeria',
    canada: 'Canada',
    morocco: 'Morocco',
    burundi: 'Burundi',
    senegal: 'Senegal',
    niger: 'Niger',
    netherlands: 'Netherlands',
    togo: 'Togo',
    burkina_faso: 'Burkina Faso',
    belgium: 'Belgium',
    congo_brazzaville: 'Congo - Brazzaville',
    italy: 'Italy',
    benin: 'Benin',
    romania: 'Romania',
    guinea: 'Guinea',
    congo_kinshasa: 'Congo - Kinshasa',
    chad: 'Chad',
    central_african_republic: 'Central African Republic',
    united_states: 'United States',
    switzerland: 'Switzerland',
    portugal: 'Portugal',
    gabon: 'Gabon',
    syria: 'Syria',
    greece: 'Greece',
    austria: 'Austria',
    ireland: 'Ireland',
    reunion: 'Réunion',
    mauritania: 'Mauritania',
    luxembourg: 'Luxembourg',
    haiti: 'Haiti',
    comoros: 'Comoros',
    martinique: 'Martinique',
    guadeloupe: 'Guadeloupe',
    hungary: 'Hungary',
    new_caledonia: 'New Caledonia',
    french_polynesia: 'French Polynesia',
    french_guiana: 'French Guiana',
    vanuatu: 'Vanuatu',
    mayotte: 'Mayotte',
    cyprus: 'Cyprus',
    equatorial_guinea: 'Equatorial Guinea',
    seychelles: 'Seychelles',
    malta: 'Malta',
    mauritius: 'Mauritius',
    st_martin: 'St. Martin',
    monaco: 'Monaco',
    lebanon: 'Lebanon',
    djibouti: 'Djibouti',
    wallis_et_futuna: 'Wallis & Futuna',
    st_barthelemy: 'St. Barthélemy',
    andorra: 'Andorra',
    st_pierre_et_miquelon: 'St. Pierre & Miquelon',
    rwanda: 'Rwanda',
  },
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

type Age = keyof typeof AGES;
type Gender = keyof typeof GENDERS;

export namespace User {
  export interface State {
    userId: string;
    email: string;
    username: string;
    sendEmails: boolean;
    accent: string;
    accents?: {
      [locale: string]: string;
    };
    age: Age;
    gender: Gender;
    clips: number;
    privacyAgreed: boolean;
    hasDownloaded: boolean;

    recordTally: number;
    validateTally: number;
  }

  export interface UpdatableState {
    email?: string;
    username?: string;
    sendEmails?: boolean;
    accents?: { [locale: string]: string };
    age?: Age;
    gender?: Gender;
    privacyAgreed?: boolean;
    hasDownloaded?: boolean;
  }

  function getDefaultState(): State {
    return {
      userId: generateGUID(),
      email: '',
      username: '',
      sendEmails: false,
      accent: '',
      accents: {},
      age: '',
      gender: '',
      clips: 0,
      privacyAgreed: false,
      hasDownloaded: false,
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

  export type Action =
    | UpdateAction
    | TallyRecordingAction
    | TallyVerificationAction;

  export const actions = {
    update: (state: UpdatableState) => (
      dispatch: any,
      getState: () => StateTree
    ) => {
      dispatch({
        type: ActionType.UPDATE,
        state,
      });
      const { api } = getState();
      api.syncUser().catch(error => console.log(error));
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

  export function reducer(state = getDefaultState(), action: Action): State {
    switch (action.type) {
      case ActionType.UPDATE:
        return { ...state, ...action.state };

      case ActionType.TALLY_RECORDING:
        return { ...state, recordTally: state.recordTally + 1 };

      case ActionType.TALLY_VERIFICATION:
        return { ...state, validateTally: state.validateTally + 1 };

      default:
        return {
          accents: state.accent ? { [DEFAULT_LOCALE]: state.accent } : {},
          ...state,
        };
    }
  }

  export const selectors = {
    hasEnteredInfo: createSelector<State, UpdatableState, boolean>(
      (state: State) =>
        pick(state, 'email', 'username', 'accent', 'age', 'gender'),
      (state: any) => Object.keys(state).some(k => Boolean(state[k]))
    ),
  };
}
