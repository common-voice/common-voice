/* eslint-disable @typescript-eslint/no-namespace */
import { Dispatch } from 'redux';
import StateTree from './tree';

export namespace Locale {
  export type State = string;

  enum ActionType {
    SET = 'SET_LOCALE',
  }

  interface SetAction {
    type: ActionType.SET;
    locale: string;
  }

  export type Action = SetAction;

  export const actions = {
    set:
      (locale: string) =>
      (dispatch: Dispatch<SetAction>, getState: () => StateTree) => {
        if (getState().locale === locale) return;

        dispatch({
          type: ActionType.SET,
          locale,
        });
      },
  };

  export function reducer(state: State = null, action: Action): State {
    switch (action.type) {
      case ActionType.SET:
        return action.locale;

      default:
        return state;
    }
  }
}
