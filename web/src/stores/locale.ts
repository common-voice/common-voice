import { DEFAULT_LOCALE } from '../services/localization';

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
    set: (locale: string): SetAction => ({
      type: ActionType.SET,
      locale,
    }),
  };

  export function reducer(
    state: State = DEFAULT_LOCALE,
    action: Action
  ): State {
    switch (action.type) {
      case ActionType.SET:
        return action.locale;

      default:
        return state;
    }
  }
}
