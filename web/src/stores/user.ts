const pick = require('lodash.pick');
import { Dispatch } from 'redux';
import { createSelector } from 'reselect';
import { UserClient } from '../../../common/user-clients';
import { DEFAULT_LOCALE } from '../services/localization';
import { generateGUID } from '../utility';
import { AGES, SEXES } from './demographics';
import StateTree from './tree';

type Age = keyof typeof AGES;
type Sex = keyof typeof SEXES;

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
    gender: Sex;
    clips: number;
    privacyAgreed: boolean;
    hasDownloaded: boolean;

    recordTally: number;
    validateTally: number;

    userClients: UserClient[];
    isFetchingAccount: boolean;
    account: UserClient;
  }

  export interface UpdatableState {
    email?: string;
    username?: string;
    sendEmails?: boolean;
    accents?: { [locale: string]: string };
    age?: Age;
    gender?: Sex;
    privacyAgreed?: boolean;
    hasDownloaded?: boolean;
    userClients?: UserClient[];
    isFetchingAccount?: boolean;
    account?: UserClient;
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
      userClients: [],
      isFetchingAccount: true,
      account: null,
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
      dispatch: Dispatch<UpdateAction>,
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

    refresh: () => async (
      dispatch: Dispatch<UpdateAction>,
      getState: () => StateTree
    ) => {
      const { api } = getState();
      dispatch({
        type: ActionType.UPDATE,
        state: { isFetchingAccount: true },
      });
      const [account, userClients] = await Promise.all([
        api.fetchAccount(),
        api.fetchUserClients(),
      ]);
      dispatch({
        type: ActionType.UPDATE,
        state: { account, userClients, isFetchingAccount: false },
      });
    },
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
