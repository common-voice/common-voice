import { Dispatch } from 'redux';
import StateTree from './tree';

export namespace RequestedLanguages {
  export interface State {
    isLoading: boolean;
    languages: string[];
  }

  enum ActionType {
    FETCH = 'FETCH_REQUESTED_LANGUAGES',
    SET = 'SET_REQUESTED_LANGUAGES',
    CREATE = 'CREATE_LANGUAGE_REQUEST',
  }

  interface FetchAction {
    type: ActionType.FETCH;
  }

  interface SetAction {
    type: ActionType.SET;
    languages: string[];
  }

  export type Action = FetchAction | SetAction;

  export const actions = {
    fetch: () => async (
      dispatch: Dispatch<FetchAction | SetAction>,
      getState: () => StateTree
    ) => {
      const { api, requestedLanguages: { isLoading, languages } } = getState();
      if (isLoading || languages) return;

      dispatch({
        type: ActionType.FETCH,
      });
      dispatch(actions.set(await api.fetchRequestedLanguages()));
    },

    set: (languages: string[]): SetAction => ({
      type: ActionType.SET,
      languages,
    }),

    create: (language: string) => async (
      dispatch: Dispatch<Action>,
      getState: () => StateTree
    ) => {
      await getState().api.requestLanguage(language);
      actions.fetch()(dispatch, getState);
    },
  };

  export function reducer(
    state: State = { languages: null, isLoading: false },
    action: Action
  ): State {
    switch (action.type) {
      case ActionType.FETCH:
        return { ...state, isLoading: true };

      case ActionType.SET:
        return { ...state, languages: action.languages };

      default:
        return state;
    }
  }
}
