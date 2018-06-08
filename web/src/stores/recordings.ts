import { Action as ReduxAction, Dispatch } from 'redux';
import { createSelector } from 'reselect';
const contributableLocales = require('../../../locales/contributable.json') as string[];
import { trackRecording } from '../services/tracker';
import StateTree from './tree';

const CACHE_SET_COUNT = 10;
const SET_COUNT = 3;

export namespace Recordings {
  export interface Sentence {
    id: string;
    text: string;
  }

  interface Recording {
    blob: Blob;
    url: string;
  }

  export interface SentenceRecording {
    sentence: Sentence;
    recording?: Recording;
  }

  interface LocaleRecordings {
    reRecordSentenceId?: string;
    sentences: Sentence[];
    sentenceRecordings: SentenceRecording[];
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
    REMOVE_SENTENCES = 'REMOVE_SENTENCES',
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

  interface RemoveSentencesAction extends ReduxAction {
    type: ActionType.REMOVE_SENTENCES;
    sentenceIds: string[];
  }

  export type Action =
    | SetRecordingAction
    | RefillSentencesAction
    | BuildSentenceSetAction
    | ReRecordSentenceAction
    | RemoveSentencesAction;

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

    removeSentences: (sentenceIds: string[]) => async (
      dispatch: Dispatch<RemoveSentencesAction | RefillSentencesAction>,
      getState: () => StateTree
    ) => {
      dispatch({ type: ActionType.REMOVE_SENTENCES, sentenceIds });
      actions.refillSentences()(dispatch, getState);
    },
  };

  export function reducer(
    locale: string,
    state: State = contributableLocales.reduce(
      (state, locale) => ({
        ...state,
        [locale]: {
          reRecordSentenceId: null,
          sentenceRecordings: [],
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
        const { sentenceId, recording: newRecording } = action;
        if (
          localeState.sentenceRecordings.find(
            ({ sentence }) => sentence.id === sentenceId
          ).recording
        ) {
          trackRecording('rerecord', locale);
        }
        return {
          ...state,
          [locale]: {
            ...localeState,
            reRecordSentenceId: null,
            sentenceRecordings: localeState.sentenceRecordings.map(
              ({ sentence, recording }) => ({
                sentence,
                recording:
                  sentence.id === sentenceId ? newRecording : recording,
              })
            ),
          },
        };

      case ActionType.REFILL_SENTENCES:
        const sentenceIds = localeState.sentences
          .map(s => s.id)
          .concat(
            localeState.sentenceRecordings.map(({ sentence }) => sentence.id)
          );
        return {
          ...state,
          [locale]: {
            ...localeState,
            sentences: localeState.sentences.concat(
              action.sentences.filter(({ id }) => !sentenceIds.includes(id))
            ),
          },
        };

      case ActionType.BUILD_SENTENCE_SET:
        const sentences = localeState.sentences.slice();
        const sentenceSet = sentences.splice(0, SET_COUNT);
        return {
          ...state,
          [locale]: {
            ...localeState,
            sentences,
            sentenceRecordings: sentenceSet.map(sentence => ({
              sentence,
            })),
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

      case ActionType.REMOVE_SENTENCES:
        return {
          ...state,
          [locale]: {
            ...localeState,
            sentences: localeState.sentences.filter(
              ({ id }) => !action.sentenceIds.includes(id)
            ),
          },
        };

      default:
        return state;
    }
  }

  export const selectors = {
    localeRecordings,

    areEnoughSentencesLoaded: createSelector<StateTree, Sentence[], boolean>(
      state => localeRecordings(state).sentences,
      sentences => sentences.length >= SET_COUNT
    ),

    isSetFull: createSelector<StateTree, SentenceRecording[], string, boolean>(
      state => (localeRecordings(state) || ({} as any)).sentenceRecordings,
      state => (localeRecordings(state) || ({} as any)).reRecordSentenceId,
      (sentenceRecordings, reRecordSentence) =>
        sentenceRecordings &&
        !reRecordSentence &&
        sentenceRecordings.filter(({ recording }) => recording).length >=
          SET_COUNT
    ),

    recordingsCount: createSelector<StateTree, SentenceRecording[], number>(
      state => localeRecordings(state).sentenceRecordings,
      sentenceRecordings =>
        sentenceRecordings.filter(({ recording }) => recording).length
    ),
  };
}
