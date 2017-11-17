import { Action as ReduxAction, Dispatch } from 'redux';
import { createSelector } from 'reselect';
import StateTree from './tree';

const CACHE_SET_COUNT = 9;
const SET_COUNT = 3;

export namespace Recordings {
  enum ActionType {
    SET_RECORDING = 'SET_RECORDING',
    REFILL_SENTENCE_CACHE = 'REFILL_SENTENCE_CACHE',
    SET_SENTENCES = 'SET_SENTENCES',
  }

  interface Recording {
    blob: Blob;
    url: string;
  }

  interface SetRecordingAction extends ReduxAction {
    type: ActionType.SET_RECORDING;
    sentence: string;
    recording: Recording;
  }

  interface RefillSentenceCacheAction extends ReduxAction {
    type: ActionType.REFILL_SENTENCE_CACHE;
    sentences: string[];
  }

  interface SetSentencesAction extends ReduxAction {
    type: ActionType.SET_SENTENCES;
    sentences: string[];
    sentenceCache: string[];
  }

  export type Action =
    | SetRecordingAction
    | RefillSentenceCacheAction
    | SetSentencesAction;

  export const actions = {
    set: (sentence: string, recording?: Recording): SetRecordingAction => ({
      type: ActionType.SET_RECORDING,
      sentence,
      recording,
    }),

    refillSentenceCache: () => async (
      dispatch: Dispatch<RefillSentenceCacheAction>,
      getState: () => StateTree
    ) => {
      try {
        const state = getState();
        const { recordings } = state;
        if (recordings.sentenceCache.length >= CACHE_SET_COUNT) {
          return;
        }
        const newSentences = await state.api.getRandomSentences(
          CACHE_SET_COUNT
        );
        dispatch({
          type: ActionType.REFILL_SENTENCE_CACHE,
          sentences: newSentences,
        });
      } catch (err) {
        console.error('could not fetch sentences', err);
      }
    },

    buildNewSentenceSet: () => async (
      dispatch: Dispatch<RefillSentenceCacheAction | SetSentencesAction>,
      getState: () => StateTree
    ) => {
      if (!selectors.areEnoughSentencesLoaded(getState().recordings)) {
        await actions.refillSentenceCache()(dispatch, getState);
      }

      const sentenceCache = getState().recordings.sentenceCache.slice();
      dispatch({
        type: ActionType.SET_SENTENCES,
        sentences: sentenceCache.splice(0, SET_COUNT),
        sentenceCache,
      });

      // Preemptively fill sentence cache when we get low.
      if (sentenceCache.length < SET_COUNT * 2) {
        await actions.refillSentenceCache()(dispatch, getState);
      }
    },
  };

  export interface SentenceRecordings {
    [sentence: string]: Recording;
  }

  export interface State {
    sentenceCache: string[];
    sentenceRecordings: SentenceRecordings;
  }

  export function reducer(
    state: State = {
      sentenceRecordings: {},
      sentenceCache: [],
    },
    action: Action
  ): State {
    switch (action.type) {
      case ActionType.SET_RECORDING:
        const { sentence, recording } = action;
        return {
          ...state,
          sentenceRecordings: {
            ...state.sentenceRecordings,
            [sentence]: recording,
          },
        };

      case ActionType.REFILL_SENTENCE_CACHE:
        return {
          ...state,
          sentenceCache: state.sentenceCache.concat(action.sentences),
        };

      case ActionType.SET_SENTENCES:
        return {
          ...state,
          sentenceCache: action.sentenceCache,
          sentenceRecordings: action.sentences.reduce(
            (obj: SentenceRecordings, sentence: string) => {
              obj[sentence] = null;
              return obj;
            },
            {}
          ),
        };

      default:
        return state;
    }
  }

  export const selectors = {
    areEnoughSentencesLoaded: createSelector<State, string[], boolean>(
      state => state.sentenceCache,
      sentenceCache => sentenceCache.length >= SET_COUNT
    ),

    isSetFull: createSelector<State, SentenceRecordings, boolean>(
      state => state.sentenceRecordings,
      sentenceRecordings =>
        Object.entries(sentenceRecordings).filter(
          ([sentence, recording]) => recording
        ).length >= SET_COUNT
    ),

    recordingsCount: createSelector<State, SentenceRecordings, number>(
      state => state.sentenceRecordings,
      sentenceRecordings =>
        Object.keys(sentenceRecordings).reduce(
          (sum, sentence) => sum + (sentenceRecordings[sentence] ? 1 : 0),
          0
        )
    ),
  };
}
