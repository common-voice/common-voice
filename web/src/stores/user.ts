import { Dispatch } from 'redux';
import { UserClient, UserLanguage } from 'common';
import { generateGUID, generateToken } from '../utility';
import StateTree from './tree';

export const VISIBLE_FOR_NONE = 0;
export const VISIBLE_FOR_ALL = 1;
export const VISIBLE_FOR_TEAM = 2;

export namespace User {
  export interface State {
    userId: string;
    authToken: string;
    email: string;
    sendEmails: boolean;
    hasDownloaded: false;
    privacyAgreed: boolean;
    recordTally: number;
    validateTally: number;

    userClients: UserClient[];
    isFetchingAccount: boolean;
    isSubscribedToMailingList: boolean;
    account: UserClient;
  }

  function getDefaultState(): State {
    return {
      userId: generateGUID(),
      authToken: generateToken(),
      email: null,
      sendEmails: false,
      hasDownloaded: false,
      privacyAgreed: false,
      recordTally: 0,
      validateTally: 0,
      isSubscribedToMailingList: false,

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
    state: Partial<State>;
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
    update: (state: Partial<State>): UpdateAction => ({
      type: ActionType.UPDATE,
      state,
    }),

    tallyRecording: (): TallyRecordingAction => ({
      type: ActionType.TALLY_RECORDING,
    }),

    tallyVerification: (): TallyVerificationAction => ({
      type: ActionType.TALLY_VERIFICATION,
    }),

    refresh:
      () =>
      async (dispatch: Dispatch<UpdateAction>, getState: () => StateTree) => {
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
          state: {
            account,
            userClients,
            isFetchingAccount: false,
            isSubscribedToMailingList: Boolean(account?.basket_token),
          },
        });
        await actions.claimLocalUser(dispatch, getState);
      },

    saveAccount:
      (data: UserClient) =>
      async (dispatch: Dispatch<UpdateAction>, getState: () => StateTree) => {
        const { api } = getState();
        dispatch({
          type: ActionType.UPDATE,
          state: { isFetchingAccount: true },
        });
        dispatch({
          type: ActionType.UPDATE,
          state: {
            account: await api.saveAccount(data),
            isFetchingAccount: false,
          },
        });
        await actions.claimLocalUser(dispatch, getState);
      },

    saveAnonymousAccountLanguages:
      (data: { languages: UserLanguage[] }) =>
      async (dispatch: Dispatch<UpdateAction>, getState: () => StateTree) => {
        const { api } = getState();
        dispatch({
          type: ActionType.UPDATE,
          state: { isFetchingAccount: true },
        });

        dispatch({
          type: ActionType.UPDATE,
          state: {
            account: await api.saveAnonymousAccountLanguages(data),
            isFetchingAccount: false,
          },
        });
        await actions.claimLocalUser(dispatch, getState);
      },

    claimLocalUser: async (
      dispatch: Dispatch<UpdateAction>,
      getState: () => StateTree
    ) => {
      const { api, user } = getState();
      if (user.account && user.userId) {
        await api.claimAccount();
        dispatch({
          type: ActionType.UPDATE,
          state: {
            userId: null,
            recordTally: 0,
            validateTally: 0,
          },
        });
        actions.refresh()(dispatch, getState);
      }
    },
  };

  export function reducer(state = getDefaultState(), action: Action): State {
    state = {
      ...state,
      userId:
        state.userId ||
        (state.isFetchingAccount || state.account ? null : generateGUID()),
    };
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
}
