import { Action as ReduxAction, Dispatch } from 'redux';
const contributableLocales = require('../../../locales/contributable.json') as string[];
import StateTree from './tree';

const CACHE_SET_COUNT = 10;

export namespace Sentences {
  export interface Sentence {
    id: string;
    text: string;
  }

  export interface State {
    [locale: string]: Sentence[];
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
        if (Object.keys(localeSentences(state)).length >= CACHE_SET_COUNT) {
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
        [locale]: [],
      }),
      {}
    ),
    action: Action
  ): State {
    const localeState = state[locale];

    switch (action.type) {
      case ActionType.REFILL:
        const sentenceIds = localeState
          .map(s => s.id)
          .concat(localeState.map(s => s.id));
        return {
          ...state,
          [locale]: localeState.concat(
            action.sentences.filter(({ id }) => !sentenceIds.includes(id))
          ),
        };

      case ActionType.REMOVE:
        return {
          ...state,
          [locale]: localeState.filter(s => !action.sentenceIds.includes(s.id)),
        };

      default:
        return state;
    }
  }

  export const selectors = {
    localeSentences,
  };
}
