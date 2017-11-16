import { Action, Dispatch } from 'redux';
import { createSelector } from 'reselect';
import StateTree from './tree';
import { apiSelector } from './user';

const CACHE_SET_COUNT = 9;
const SET_COUNT = 3;

enum ActionType {
  SET_RECORDING = 'SET_RECORDING',
  REFILL_SENTENCE_CACHE = 'REFILL_SENTENCE_CACHE',
  SET_SENTENCES = 'SET_SENTENCES',
}

interface Recording {
  blob: Blob;
  url: string;
}

interface SetRecordingAction extends Action {
  type: ActionType.SET_RECORDING;
  sentence: string;
  recording: Recording;
}

interface RefillSentenceCacheAction extends Action {
  type: ActionType.REFILL_SENTENCE_CACHE;
  sentences: string[];
}

interface SetSentencesAction extends Action {
  type: ActionType.SET_SENTENCES;
  sentences: string[];
  sentenceCache: string[];
}

type RecordingsAction =
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
      const { recordings, user } = getState();
      if (recordings.sentenceCache.length >= CACHE_SET_COUNT) {
        return;
      }
      const newSentences = await apiSelector(user).getRandomSentences(
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
    if (!areEnoughSentencesLoadedSelector(getState().recordings)) {
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

export interface RecordingsState {
  sentenceCache: string[];
  sentenceRecordings: SentenceRecordings;
}

export default function reducer(
  state: RecordingsState = {
    sentenceRecordings: {},
    sentenceCache: [],
  },
  action: RecordingsAction
): RecordingsState {
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

export const areEnoughSentencesLoadedSelector = createSelector<
  RecordingsState,
  string[],
  boolean
>(
  state => state.sentenceCache,
  sentenceCache => sentenceCache.length >= SET_COUNT
);

export const isSetFullSelector = createSelector<
  RecordingsState,
  SentenceRecordings,
  boolean
>(
  state => state.sentenceRecordings,
  sentenceRecordings =>
    Object.entries(sentenceRecordings).filter(
      ([sentence, recording]) => recording
    ).length >= SET_COUNT
);

export const recordingsCountSelector = createSelector<
  RecordingsState,
  SentenceRecordings,
  number
>(
  state => state.sentenceRecordings,
  sentenceRecordings =>
    Object.keys(sentenceRecordings).reduce(
      (sum, sentence) => sum + (sentenceRecordings[sentence] ? 1 : 0),
      0
    )
);
