import { Action as ReduxAction, Dispatch } from 'redux';
const contributableLocales = require('../../../locales/contributable.json') as string[];
import StateTree from './tree';
import { Sentence } from 'common';

const CACHE_SET_COUNT = 15;

export namespace Sentences {
  export interface State {
    [locale: string]: { sentences: Sentence[]; isLoading: boolean };
  }

  const localeSentences = ({ locale, sentences }: StateTree) =>
    sentences[locale];

  enum ActionType {
    REFILL = 'REFILL_SENTENCES',
    REMOVE = 'REMOVE_SENTENCES',
  }

  interface RefillAction extends ReduxAction {
    type: ActionType.REFILL;
    sentences: Sentence[];
  }

  interface RemoveAction extends ReduxAction {
    type: ActionType.REMOVE;
    sentenceIds: string[];
  }

  export type Action = RefillAction | RemoveAction;

  export const actions = {
    refill: () => async (
      dispatch: Dispatch<RefillAction>,
      getState: () => StateTree
    ) => {
      try {
        const state = getState();
        if (
          Object.keys(localeSentences(state).sentences).length >=
          CACHE_SET_COUNT
        ) {
          return;
        }
        const newSentences = await state.api.fetchRandomSentences(
          CACHE_SET_COUNT
        );
        dispatch({
          type: ActionType.REFILL,
          sentences: newSentences,
        });
      } catch (err) {
        console.error('could not fetch sentences', err);
      }
    },

    remove: (sentenceIds: string[]) => async (
      dispatch: Dispatch<RemoveAction | RefillAction>,
      getState: () => StateTree
    ) => {
      dispatch({ type: ActionType.REMOVE, sentenceIds });
      actions.refill()(dispatch, getState);
    },
  };

  export function reducer(
    locale: string,
    state: State = contributableLocales.reduce(
      (state, locale) => ({
        ...state,
        [locale]: { sentences: [], isLoading: true },
      }),
      {}
    ),
    action: Action
  ): State {
    const localeState = state[locale];

    switch (action.type) {
      case ActionType.REFILL:
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
          },
        };

      default:
        return state;
    }
  }

  export const selectors = {
    localeSentences,
    isLoading: true,
  };
}
