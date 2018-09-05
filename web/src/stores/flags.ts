export namespace Flags {
  export interface State {
    showNewHome: boolean;
  }

  enum ActionType {
    SHOW_NEW_HOME = 'SHOW_NEW_HOME',
  }

  interface ShowNewHomeAction {
    type: ActionType.SHOW_NEW_HOME;
  }

  export type Action = ShowNewHomeAction;

  export const actions = {
    showNewHome: () => ({
      type: ActionType.SHOW_NEW_HOME,
    }),
  };

  export function reducer(
    state: State = {
      showNewHome: localStorage.getItem('showNewHome') === 'true',
    },
    action: Action
  ): State {
    switch (action.type) {
      case ActionType.SHOW_NEW_HOME:
        return { ...state, showNewHome: true };

      default:
        return state;
    }
  }
}
