import { Action as ReduxAction, Dispatch } from 'redux';
import { createSelector } from 'reselect';
const contributableLocales = require('../../../locales/contributable.json') as string[];
import { trackRecording } from '../services/tracker';
import StateTree from './tree';

const CACHE_SET_COUNT = 9;
const SET_COUNT = 3;

export namespace Recordings {
  interface Sentence {
    id: string;
    text: string;
  }

  interface Recording {
    blob: Blob;
    url: string;
  }

  export interface SentenceRecordings {
    [sentenceId: string]: Recording;
  }

  interface LocaleRecordings {
    reRecordSentenceId?: string;
    sentences: { [id: string]: string };
    sentenceRecordings: SentenceRecordings;
  }

  export interface State {
    [locale: string]: LocaleRecordings;
  }

  const localeRecordings = ({ locale, recordings }: StateTree) =>
    recordings[locale];

  enum ActionType {
    SET_RECORDING = 'SET_RECORDING',
    REFILL_SENTENCES = 'REFILL_SENTENCES',
    BUILD_SENTENCE_SET = 'BUILD_SENTENCE_SET',
    RE_RECORD_SENTENCE = 'RE_RECORD_SENTENCE',
  }

  interface SetRecordingAction extends ReduxAction {
    type: ActionType.SET_RECORDING;
    sentenceId: string;
    recording: Recording;
  }

  interface RefillSentencesAction extends ReduxAction {
    type: ActionType.REFILL_SENTENCES;
    sentences: Sentence[];
  }

  interface BuildSentenceSetAction extends ReduxAction {
    type: ActionType.BUILD_SENTENCE_SET;
  }

  interface ReRecordSentenceAction extends ReduxAction {
    type: ActionType.RE_RECORD_SENTENCE;
    sentenceId: string;
  }

  export type Action =
    | SetRecordingAction
    | RefillSentencesAction
    | BuildSentenceSetAction
    | ReRecordSentenceAction;

  export const actions = {
    set: (sentenceId: string, recording?: Recording): SetRecordingAction => ({
      type: ActionType.SET_RECORDING,
      sentenceId,
      recording,
    }),

    refillSentences: () => async (
      dispatch: Dispatch<RefillSentencesAction>,
      getState: () => StateTree
    ) => {
      try {
        const state = getState();
        if (
          Object.keys(localeRecordings(state).sentences).length >=
          CACHE_SET_COUNT
        ) {
          return;
        }
        const newSentences = await state.api.fetchRandomSentences(
          CACHE_SET_COUNT
        );
        dispatch({
          type: ActionType.REFILL_SENTENCES,
          sentences: newSentences,
        });
      } catch (err) {
        console.error('could not fetch sentences', err);
      }
    },

    buildNewSentenceSet: () => async (
      dispatch: Dispatch<RefillSentencesAction | BuildSentenceSetAction>,
      getState: () => StateTree
    ) => {
      if (!selectors.areEnoughSentencesLoaded(getState())) {
        await actions.refillSentences()(dispatch, getState);
      }

      dispatch({
        type: ActionType.BUILD_SENTENCE_SET,
      });

      // Preemptively fill sentence cache when we get low.
      if (
        Object.keys(localeRecordings(getState()).sentences).length <
        SET_COUNT * 2
      ) {
        await actions.refillSentences()(dispatch, getState);
      }
    },

    setReRecordSentence: (sentenceId: string): ReRecordSentenceAction => ({
      type: ActionType.RE_RECORD_SENTENCE,
      sentenceId,
    }),
  };

  export function reducer(
    locale: string,
    state: State = contributableLocales.reduce(
      (state, locale) => ({
        ...state,
        [locale]: {
          reRecordSentenceId: null,
          sentenceRecordings: {},
          sentences: [],
        },
      }),
      {}
    ),
    action: Action
  ): State {
    const localeState = state[locale];

    switch (action.type) {
      case ActionType.SET_RECORDING:
        const { sentenceId, recording } = action;
        if (localeState.sentenceRecordings[sentenceId]) {
          trackRecording('rerecord');
        }
        return {
          ...state,
          [locale]: {
            ...localeState,
            reRecordSentenceId: null,
            sentenceRecordings: {
              ...localeState.sentenceRecordings,
              [sentenceId]: recording,
            },
          },
        };

      case ActionType.REFILL_SENTENCES:
        return {
          ...state,
          [locale]: {
            ...localeState,
            sentences: action.sentences.reduce(
              (obj, { id, text }) => ({ ...obj, [id]: text }),
              { ...localeState.sentences }
            ),
          },
        };

      case ActionType.BUILD_SENTENCE_SET:
        const sentencePairs = Object.entries(localeState.sentences).filter(
          ([id]) => !Object.keys(localeState.sentenceRecordings).includes(id)
        );
        const sentenceSet = sentencePairs.slice().splice(0, SET_COUNT);
        return {
          ...state,
          [locale]: {
            ...localeState,
            sentences: sentencePairs.reduce(
              (obj: { [id: string]: string }, [id, text]) => ({
                ...obj,
                [id]: text,
              }),
              {}
            ),
            sentenceRecordings: sentenceSet.reduce(
              (obj: SentenceRecordings, [id]) => {
                obj[id] = null;
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
            reRecordSentenceId: action.sentenceId,
          },
        };

      default:
        return state;
    }
  }

  export const selectors = {
    localeRecordings,

    areEnoughSentencesLoaded: createSelector<
      StateTree,
      { [id: string]: string },
      boolean
    >(
      state => localeRecordings(state).sentences,
      sentences => Object.keys(sentences).length >= SET_COUNT
    ),

    isSetFull: createSelector<StateTree, SentenceRecordings, string, boolean>(
      state => (localeRecordings(state) || ({} as any)).sentenceRecordings,
      state => (localeRecordings(state) || ({} as any)).reRecordSentenceId,
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
