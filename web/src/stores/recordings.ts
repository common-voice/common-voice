import { Action as ReduxAction, Dispatch } from 'redux';
import { createSelector } from 'reselect';
const contributableLocales = require('../../../locales/contributable.json') as string[];
import { trackRecording } from '../services/tracker';
import StateTree from './tree';

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

  interface LocaleRecordings {
    reRecordSentence?: string;
    sentenceCache: string[];
    sentenceRecordings: SentenceRecordings;
  }

  export interface State {
    [locale: string]: LocaleRecordings;
  }

  const localeRecordings = ({ locale, recordings }: StateTree) =>
    recordings[locale];

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
        if (localeRecordings(state).sentenceCache.length >= CACHE_SET_COUNT) {
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
      if (!selectors.areEnoughSentencesLoaded(getState())) {
        await actions.refillSentenceCache()(dispatch, getState);
      }

      const sentenceCache = localeRecordings(getState()).sentenceCache.slice();
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
    locale: string,
    state: State = contributableLocales.reduce(
      (state, locale) => ({
        ...state,
        [locale]: {
          reRecordSentence: null,
          sentenceRecordings: {},
          sentenceCache: [],
        },
      }),
      {}
    ),
    action: Action
  ): State {
    const localeState = state[locale];

    switch (action.type) {
      case ActionType.SET_RECORDING:
        const { sentence, recording } = action;
        if (localeState.sentenceRecordings[sentence]) {
          trackRecording('rerecord');
        }
        return {
          ...state,
          [locale]: {
            ...localeState,
            reRecordSentence: null,
            sentenceRecordings: {
              ...localeState.sentenceRecordings,
              [sentence]: recording,
            },
          },
        };

      case ActionType.REFILL_SENTENCE_CACHE:
        return {
          ...state,
          [locale]: {
            ...localeState,
            sentenceCache: localeState.sentenceCache.concat(action.sentences),
          },
        };

      case ActionType.SET_SENTENCES:
        return {
          ...state,
          [locale]: {
            ...localeState,
            sentenceCache: action.sentenceCache,
            sentenceRecordings: action.sentences.reduce(
              (obj: SentenceRecordings, sentence: string) => {
                obj[sentence] = null;
                return obj;
              },
              {}
            ),
          },
        };

      case ActionType.RE_RECORD_SENTENCE:
        return {
          ...state,
          [locale]: {
            ...localeState,
            reRecordSentence: action.sentence,
          },
        };

      default:
        return state;
    }
  }

  export const selectors = {
    localeRecordings,

    areEnoughSentencesLoaded: createSelector<StateTree, string[], boolean>(
      state => localeRecordings(state).sentenceCache,
      sentenceCache => sentenceCache.length >= SET_COUNT
    ),

    isSetFull: createSelector<StateTree, SentenceRecordings, string, boolean>(
      state => (localeRecordings(state) || ({} as any)).sentenceRecordings,
      state => (localeRecordings(state) || ({} as any)).reRecordSentence,
      (sentenceRecordings, reRecordSentence) =>
        sentenceRecordings &&
        !reRecordSentence &&
        Object.entries(sentenceRecordings).filter(
          ([sentence, recording]) => recording
        ).length >= SET_COUNT
    ),

    recordingsCount: createSelector<StateTree, SentenceRecordings, number>(
      state => localeRecordings(state).sentenceRecordings,
      sentenceRecordings =>
        Object.keys(sentenceRecordings).reduce(
          (sum, sentence) => sum + (sentenceRecordings[sentence] ? 1 : 0),
          0
        )
    ),
  };
}
