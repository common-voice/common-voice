import { Action as ReduxAction, Dispatch } from 'redux';
import { createSelector } from 'reselect';
import StateTree from './tree';
import { trackRecording } from '../services/tracker';

const CACHE_SET_COUNT = 9;
const SET_COUNT = 3;

export namespace Recordings {
  interface Recording {
    blob: Blob;
    url: string;
  }

  export interface SentenceRecordings {
    [sentence: string]: Recording;
  }

  export interface State {
    reRecordSentence?: string;
    sentenceCache: string[];
    sentenceRecordings: SentenceRecordings;
  }

  enum ActionType {
    SET_RECORDING = 'SET_RECORDING',
    REFILL_SENTENCE_CACHE = 'REFILL_SENTENCE_CACHE',
    SET_SENTENCES = 'SET_SENTENCES',
    RE_RECORD_SENTENCE = 'RE_RECORD_SENTENCE',
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

  interface ReRecordSentenceAction extends ReduxAction {
    type: ActionType.RE_RECORD_SENTENCE;
    sentence: string;
  }

  export type Action =
    | SetRecordingAction
    | RefillSentenceCacheAction
    | SetSentencesAction
    | ReRecordSentenceAction;

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
        const newSentences = await state.api.fetchRandomSentences(
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

    setReRecordSentence: (sentence: string): ReRecordSentenceAction => ({
      type: ActionType.RE_RECORD_SENTENCE,
      sentence,
    }),
  };

  export function reducer(
    state: State = {
      reRecordSentence: null,
      sentenceRecordings: {},
      sentenceCache: [],
    },
    action: Action
  ): State {
    switch (action.type) {
      case ActionType.SET_RECORDING:
        const { sentence, recording } = action;
        if (state.sentenceRecordings[sentence]) {
          trackRecording('rerecord');
        }
        return {
          ...state,
          reRecordSentence: null,
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

      case ActionType.RE_RECORD_SENTENCE:
        return {
          ...state,
          reRecordSentence: action.sentence,
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

    isSetFull: createSelector<State, SentenceRecordings, string, boolean>(
      state => state.sentenceRecordings,
      state => state.reRecordSentence,
      (sentenceRecordings, reRecordSentence) =>
        !reRecordSentence &&
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
