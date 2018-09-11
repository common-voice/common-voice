import pick = require('lodash.pick');
import { createSelector } from 'reselect';
import { DEFAULT_LOCALE } from '../services/localization';
import StateTree from './tree';

export namespace KioskProgress {
  export interface State {
    wizardFinished: boolean;
    recordFinished: boolean;
    listenFinished: boolean;
    isSubmitted: boolean;
  }

  export interface UpdatableState {
    wizardFinished?: boolean;
    recordFinished?: boolean;
    listenFinished?: boolean;
    isSubmitted?: boolean;
  }

  function getDefaultState(): State {
    return {
      wizardFinished: false,
      recordFinished: false,
      listenFinished: false,
      isSubmitted: false,
    };
  }

  enum ActionType {
    UPDATE_KIOSK = 'UPDATE_KIOSK_PROGRESS',
  }

  interface UpdateAction {
    type: ActionType.UPDATE_KIOSK;
    state: UpdatableState;
  }

  export type Action =
    | UpdateAction

  export const actions = {
    update: (state: UpdatableState): UpdateAction => ({
      type: ActionType.UPDATE_KIOSK,
      state,
    }),
  };

  export function reducer(state = getDefaultState(), action: Action): State {
    switch (action.type) {
      case ActionType.UPDATE_KIOSK:
        return { ...state, ...action.state };

      default:
        return { ...state };
    }
  }
}
