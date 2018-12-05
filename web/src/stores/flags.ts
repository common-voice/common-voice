export namespace Flags {
  export interface State {}

  enum ActionType {
    SET = 'SET_FLAGS',
  }

  interface SetFlags {
    type: ActionType.SET;
    state: State;
  }

  export type Action = SetFlags;

  export const actions = {
    set: (state: State) => ({
      type: ActionType.SET,
      state,
    }),
  };

  export function reducer(state: State = {}, action: Action): State {
    switch (action.type) {
      case ActionType.SET:
        return { ...state, ...action.state };

      default:
        return state;
    }
  }
}
