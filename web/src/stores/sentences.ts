import { Action as ReduxAction, Dispatch } from 'redux';
import StateTree from './tree';
import { Sentence } from 'common';

const CACHE_SET_COUNT = 25;
const MIN_CACHE_COUNT = 5;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Sentences {
  export interface State {
    [locale: string]: {
      sentences: Sentence[];
      isLoading: boolean;
      hasLoadingError: boolean;
    };
  }

  enum ActionType {
    REFILL = 'REFILL_SENTENCES',
    REFILL_LOAD = 'REFILL_LOAD',
    REFILL_ERROR = 'REFILL_SENTENCES_ERROR',
    REMOVE = 'REMOVE_SENTENCES',
  }

  interface RefillAction extends ReduxAction {
    type: ActionType.REFILL;
    sentences: Sentence[];
  }
  interface RefillLoadAction extends ReduxAction {
    type: ActionType.REFILL_LOAD;
  }
  interface RefillErrorAction extends ReduxAction {
    type: ActionType.REFILL_ERROR;
  }

  interface RemoveAction extends ReduxAction {
    type: ActionType.REMOVE;
    sentenceIds: string[];
  }

  export type Action =
    | RefillAction
    | RefillLoadAction
    | RefillErrorAction
    | RemoveAction;

  export const actions = {
    refill:
      () =>
      async (
        dispatch: Dispatch<RefillAction | RefillLoadAction | RefillErrorAction>,
        getState: () => StateTree
      ) => {
        try {
          const state = getState();

          // don't load if no contributable locale
          if (
            state.languages &&
            !state.languages.contributableLocales.includes(state.locale)
          ) {
            return;
          }

          if (
            Object.keys(localeSentences(state).sentences).length >=
            MIN_CACHE_COUNT
          ) {
            return;
          }

          dispatch({ type: ActionType.REFILL_LOAD });
          const newSentences = await state.api.fetchRandomSentences(
            CACHE_SET_COUNT
          );
          dispatch({
            type: ActionType.REFILL,
            sentences: newSentences,
          });
        } catch (err) {
          console.error('could not fetch sentences', err);
          dispatch({ type: ActionType.REFILL_ERROR });
        }
      },

    remove:
      (sentenceIds: string[]) =>
      async (
        dispatch: Dispatch<
          RemoveAction | RefillLoadAction | RefillAction | RefillErrorAction
        >,
        getState: () => StateTree
      ) => {
        dispatch({ type: ActionType.REMOVE, sentenceIds });
        actions.refill()(dispatch, getState);
      },
  };

  const DEFAULT_LOCALE_STATE = {
    sentences: [] as Sentence[],
    isLoading: true,
    hasLoadingError: false,
  };

  export function reducer(
    locale: string,
    state: State = {},
    action: Action
  ): State {
    const currentLocaleState = state[locale];
    const localeState = {
      ...DEFAULT_LOCALE_STATE,
      ...currentLocaleState,
    };

    switch (action.type) {
      case ActionType.REFILL: {
        const sentenceIds = localeState.sentences
          .map(s => s.id)
          .concat(localeState.sentences.map(s => s.id));

        return {
          ...state,
          [locale]: {
            sentences: localeState.sentences.concat(
              action.sentences.filter(({ id }) => !sentenceIds.includes(id))
            ),
            isLoading: false,
            hasLoadingError: false,
          },
        };
      }

      case ActionType.REFILL_LOAD:
        return {
          ...state,
          [locale]: {
            ...localeState,
            isLoading: true,
            hasLoadingError: false,
          },
        };

      case ActionType.REFILL_ERROR:
        return {
          ...state,
          [locale]: {
            sentences: [],
            isLoading: false,
            hasLoadingError: true,
          },
        };

      case ActionType.REMOVE:
        return {
          ...state,
          [locale]: {
            sentences: localeState.sentences.filter(
              s => !action.sentenceIds.includes(s.id)
            ),
            isLoading: false,
            hasLoadingError: false,
          },
        };

      default:
        return state;
    }
  }

  const localeSentences = ({ locale, sentences }: StateTree) => {
    if (!sentences[locale]) {
      return DEFAULT_LOCALE_STATE;
    }

    return sentences[locale];
  };

  export const selectors = {
    localeSentences,
  };
}
