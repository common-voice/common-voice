import pick = require('lodash.pick');
import { createSelector } from 'reselect';
import { DEFAULT_LOCALE } from '../services/localization';
import { generateGUID } from '../utility';
import StateTree from './tree';

export const ACCENTS: any = {
  ca: {
    balearic: 'català balear',
    central: 'català central',
    northwestern: 'català nord-occidental',
    northern: 'català septentrional',
    valencian: 'català valencià',
  },
  cy: {
    united_kingdom: 'Y Deyrnas Unedig Cymraeg',
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
    france: 'Français de France',
    madagascar: 'Français de Madagascar',
    cameroon: 'Français du Cameroun',
    germany: 'Français d’Allemagne',
    united_kingdom: 'Français du Royaume-Uni',
    cote_d_ivoire: 'Français de Côte d’Ivoire',
    tunisia: 'Français de Tunisie',
    mali: 'Français du Mali',
    algeria: 'Français d’Algérie',
    canada: 'Français du Canada',
    morocco: 'Français du Maroc',
    burundi: 'Français du Burundi',
    senegal: 'Français du Sénégal',
    niger: 'Français du Niger',
    netherlands: 'Français des Pays-Bas',
    togo: 'Français de la République du Togo',
    burkina_faso: 'Français du Burkina-Faso',
    belgium: 'Français de Belgique',
    congo_brazzaville: 'Français du Congo (Brazzaville)',
    congo_kinshasa: 'Français du Congo (Kinshasa)',
    italy: 'Français d’Italie',
    benin: 'Français du Bénin',
    romania: 'Français de Roumanie',
    guinea: 'Français de Guinée',
    chad: 'Français du Tchad',
    central_african_republic: 'Français de République centrafricaine',
    united_states: 'Français des États-Unis',
    switzerland: 'Français de Suisse',
    portugal: 'Français du Portugal',
    gabon: 'Français du Gabon',
    syria: 'Français de Syrie',
    greece: 'Français de Grèce',
    austria: 'Français d’Autriche',
    ireland: 'Français d’Irlande',
    reunion: 'Français de La Réunion',
    mauritania: 'Français de Mauritanie',
    luxembourg: 'Français du Luxembourg',
    haiti: 'Français d’Haïti',
    comoros: 'Français des Comores',
    martinique: 'Français de Martinique',
    guadeloupe: 'Français de Guadeloupe',
    hungary: 'Français d’Hongrie',
    new_caledonia: 'Français de Nouvelle-Calédonie',
    french_polynesia: 'Français de Polynésie française',
    french_guiana: 'Français de Guyane',
    vanuatu: 'Français du Vanuatu',
    mayotte: 'Français de Mayotte',
    cyprus: 'Français de Chypre',
    equatorial_guinea: 'Français de Guinée équatoriale',
    seychelles: 'Français des Seychelles',
    malta: 'Français de Malte',
    mauritius: 'Français de l’Île Maurice',
    st_martin: 'Français de Saint-Martin',
    monaco: 'Français de Monaco',
    lebanon: 'Français du Liban',
    djibouti: 'Français de Djibouti',
    wallis_et_futuna: 'Français de Wallis et Futuna',
    st_barthelemy: 'Français de Saint-Barthélemy',
    andorra: 'Français d’Andorre',
    st_pierre_et_miquelon: 'Français de Saint-Pierre-et-Miquelon',
    rwanda: 'Français du Rwanda',
  },
  'ga-IE': {
    mumhain: 'Gaeilge na Mumhan',
    connachta: 'Gaeilge Chonnacht',
    ulaidh: 'Gaeilge Uladh',
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
