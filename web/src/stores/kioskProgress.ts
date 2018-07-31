import pick = require('lodash.pick');
import { createSelector } from 'reselect';
import { DEFAULT_LOCALE } from '../services/localization';
import StateTree from './tree';

export namespace KioskProgress {
  export interface State {
    kioskState: Status;
  };

  export enum Status {
    nothingDone,
    emailSubmitted,
    wizardCompleted,
    recordingCompleted,
    listeningCompleted,
  }

  enum ActionTypes {
    START,
    NEXT,
  };

  interface StartAction {
    type: ActionTypes.START;
  }

  interface NextAction {
    type: ActionTypes.NEXT;
    state: Status;
  }

  export type Action =
    | StartAction
    | NextAction;

  export const actions = {
    start: (state: Status): StartAction => ({
      type: ActionTypes.START,
    }),
    next: (state: Status): NextAction => ({
      type: ActionTypes.NEXT,
      state,
    }),
  };

  export function reducer(state = { kioskState: Status.nothingDone }, action: Action): State {
    switch (action.type) {
      case ActionTypes.START:
        return { ...state };

      case ActionTypes.NEXT:
        return { ...state, kioskState: (state.kioskState < Status.listeningCompleted) ? state.kioskState + 1 : Status.nothingDone };

      default:
        return { ...state };
    }
  }
}
