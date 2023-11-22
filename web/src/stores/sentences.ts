import { Action as ReduxAction, Dispatch } from 'redux'
import StateTree from './tree'
import {
  PendingSentence,
  Sentence,
  SentenceSubmission,
  SentenceVote,
  BulkUploadStatus,
} from 'common'

const CACHE_SET_COUNT = 25
const MIN_CACHE_COUNT = 5

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Sentences {
  export interface State {
    [locale: string]: {
      sentences: Sentence[]
      isLoading: boolean
      isLoadingPendingSentences: boolean
      hasLoadingError: boolean
      pendingSentences: PendingSentence[]
      bulkUploadStatus?: BulkUploadStatus
    }
  }

  enum ActionType {
    REFILL = 'REFILL_SENTENCES',
    REFILL_LOAD = 'REFILL_LOAD',
    REFILL_ERROR = 'REFILL_SENTENCES_ERROR',
    REMOVE = 'REMOVE_SENTENCES',
    CREATE = 'CREATE_SENTENCES',
    REFILL_PENDING_SENTENCES = 'REFILL_PENDING_SENTENCES',
    REFILL_PENDING_SENTENCES_LOADING = 'REFILL_PENDING_SENTENCES_LOADING',
    VOTE_SENTENCE = 'VOTE_SENTENCE',
    SHOW_NEXT_SENTENCE = 'SHOW_NEXT_SENTENCE',
    ABORT_BULK_UPLOAD = 'ABORT_BULK_UPLOAD',
    SET_BULK_UPLOAD_STATUS = 'SET_BULK_UPLOAD_STATUS',
  }

  interface RefillAction extends ReduxAction {
    type: ActionType.REFILL
    sentences: Sentence[]
  }
  interface RefillLoadAction extends ReduxAction {
    type: ActionType.REFILL_LOAD
  }
  interface RefillErrorAction extends ReduxAction {
    type: ActionType.REFILL_ERROR
  }

  interface RemoveAction extends ReduxAction {
    type: ActionType.REMOVE
    sentenceIds: string[]
  }

  interface CreateAction extends ReduxAction {
    type: ActionType.CREATE
    newSentenceSubmission: SentenceSubmission
  }

  interface RefillPendingSentencesLoadingAction extends ReduxAction {
    type: ActionType.REFILL_PENDING_SENTENCES_LOADING
  }

  interface RefillPendingSentencesAction extends ReduxAction {
    type: ActionType.REFILL_PENDING_SENTENCES
    pendingSentences: PendingSentence[]
  }

  interface VoteSentence extends ReduxAction {
    type: ActionType.VOTE_SENTENCE
    sentenceId: string
    isValid: boolean
    sentenceIndex: number
  }

  interface ShowNextSentence extends ReduxAction {
    type: ActionType.SHOW_NEXT_SENTENCE
    sentenceId: string
  }

  interface CreateAction extends ReduxAction {
    type: ActionType.CREATE
    newSentenceSubmission: SentenceSubmission
  }

  interface AbortBulkUpload extends ReduxAction {
    type: ActionType.ABORT_BULK_UPLOAD
  }

  interface SetBulkUploadStatus extends ReduxAction {
    type: ActionType.SET_BULK_UPLOAD_STATUS
    bulkUploadStatus: BulkUploadStatus
  }

  export type Action =
    | RefillAction
    | RefillLoadAction
    | RefillErrorAction
    | RemoveAction
    | CreateAction
    | RefillPendingSentencesLoadingAction
    | RefillPendingSentencesAction
    | VoteSentence
    | ShowNextSentence
    | AbortBulkUpload
    | SetBulkUploadStatus

  export const actions = {
    refill:
      () =>
      async (
        dispatch: Dispatch<RefillAction | RefillLoadAction | RefillErrorAction>,
        getState: () => StateTree
      ) => {
        try {
          const state = getState()

          // don't load if no contributable locale
          if (
            state.languages &&
            !state.languages.contributableLocales.includes(state.locale)
          ) {
            return
          }

          if (
            Object.keys(localeSentences(state).sentences).length >=
            MIN_CACHE_COUNT
          ) {
            return
          }

          dispatch({ type: ActionType.REFILL_LOAD })
          const newSentences = await state.api.fetchRandomSentences(
            CACHE_SET_COUNT
          )
          dispatch({
            type: ActionType.REFILL,
            sentences: newSentences,
          })
        } catch (err) {
          console.error('could not fetch sentences', err)
          dispatch({ type: ActionType.REFILL_ERROR })
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
        dispatch({ type: ActionType.REMOVE, sentenceIds })
        actions.refill()(dispatch, getState)
      },

    create:
      (newSentenceSubmission: SentenceSubmission) =>
      async (dispatch: Dispatch<CreateAction>, getState: () => StateTree) => {
        const state = getState()

        dispatch({ type: ActionType.CREATE, newSentenceSubmission })
        await state.api.createSentence(newSentenceSubmission)
      },

    refillPendingSentences:
      (localeId: number) =>
      async (
        dispatch: Dispatch<
          RefillPendingSentencesAction | RefillPendingSentencesLoadingAction
        >,
        getState: () => StateTree
      ) => {
        const state = getState()

        dispatch({
          type: ActionType.REFILL_PENDING_SENTENCES_LOADING,
        })

        const data = await state.api.fetchPendingSentences(localeId)

        dispatch({
          type: ActionType.REFILL_PENDING_SENTENCES,
          pendingSentences: data.pendingSentences,
        })
      },

    voteSentence:
      (sentenceVote: SentenceVote) =>
      async (dispatch: Dispatch<VoteSentence>, getState: () => StateTree) => {
        const state = getState()

        await state.api.voteSentence({ ...sentenceVote })

        dispatch({
          type: ActionType.VOTE_SENTENCE,
          sentenceId: sentenceVote.sentence_id,
          isValid: sentenceVote.vote,
          sentenceIndex: sentenceVote.sentenceIndex,
        })
      },

    skipSentence:
      (sentenceId: string) =>
      async (
        dispatch: Dispatch<ShowNextSentence>,
        getState: () => StateTree
      ) => {
        const state = getState()

        await state.api.skipSentence(sentenceId)

        dispatch({
          type: ActionType.SHOW_NEXT_SENTENCE,
          sentenceId,
        })
      },

    showNextSentence: (sentenceId: string) => ({
      type: ActionType.SHOW_NEXT_SENTENCE,
      sentenceId,
    }),

    bulkSubmissionRequest:
      ({
        file,
        locale,
        fileName,
      }: {
        file: File
        locale: string
        fileName: string
      }) =>
      async (
        dispatch: Dispatch<SetBulkUploadStatus>,
        getState: () => StateTree
      ) => {
        const state = getState()

        dispatch({
          type: ActionType.SET_BULK_UPLOAD_STATUS,
          bulkUploadStatus: 'uploading',
        })

        return await state.api.bulkSubmissionRequest({
          file,
          locale,
          fileName,
        })
      },

    abortBulkSubmissionRequest:
      () =>
      (dispatch: Dispatch<SetBulkUploadStatus>, getState: () => StateTree) => {
        const state = getState()

        state.api.abortBulkSubmissionRequest()

        dispatch({
          type: ActionType.SET_BULK_UPLOAD_STATUS,
          bulkUploadStatus: 'error',
        })
      },

    setBulkUploadStatus: (bulkUploadStatus: BulkUploadStatus) => ({
      type: ActionType.SET_BULK_UPLOAD_STATUS,
      bulkUploadStatus,
    }),

    removeBulkSubmission: () => ({
      type: ActionType.SET_BULK_UPLOAD_STATUS,
      bulkUploadStatus: 'off',
    }),
  }

  const DEFAULT_LOCALE_STATE = {
    sentences: [] as Sentence[],
    isLoading: true,
    hasLoadingError: false,
    bulkUploadStatus: 'off',
  }

  export function reducer(
    locale: string,
    state: State = {},
    action: Action
  ): State {
    const currentLocaleState = state[locale]
    const localeState = {
      ...DEFAULT_LOCALE_STATE,
      ...currentLocaleState,
    }

    switch (action.type) {
      case ActionType.REFILL: {
        const sentenceIds = localeState.sentences
          .map(s => s.id)
          .concat(localeState.sentences.map(s => s.id))

        return {
          ...state,
          [locale]: {
            sentences: localeState.sentences.concat(
              action.sentences.filter(({ id }) => !sentenceIds.includes(id))
            ),
            isLoading: false,
            hasLoadingError: false,
            isLoadingPendingSentences:
              currentLocaleState.isLoadingPendingSentences,
            pendingSentences: currentLocaleState.pendingSentences,
          },
        }
      }

      case ActionType.REFILL_LOAD:
        return {
          ...state,
          [locale]: {
            ...localeState,
            isLoading: true,
            hasLoadingError: false,
            bulkUploadStatus: 'off',
          },
        }

      case ActionType.REFILL_ERROR:
        return {
          ...state,
          [locale]: {
            sentences: [],
            isLoading: false,
            hasLoadingError: true,
            isLoadingPendingSentences:
              currentLocaleState.isLoadingPendingSentences,
            pendingSentences: currentLocaleState.pendingSentences,
          },
        }

      case ActionType.REMOVE:
        return {
          ...state,
          [locale]: {
            sentences: localeState.sentences.filter(
              s => !action.sentenceIds.includes(s.id)
            ),
            isLoading: false,
            hasLoadingError: false,
            isLoadingPendingSentences:
              currentLocaleState.isLoadingPendingSentences,
            pendingSentences: currentLocaleState.pendingSentences,
          },
        }

      case ActionType.CREATE:
        return {
          ...state,
        }

      case ActionType.REFILL_PENDING_SENTENCES_LOADING: {
        return {
          ...state,
          [locale]: {
            ...currentLocaleState,
            pendingSentences: [],
            isLoadingPendingSentences: true,
          },
        }
      }

      case ActionType.REFILL_PENDING_SENTENCES: {
        const pendingSentences = action.pendingSentences.map(
          pendingSentence => ({
            ...pendingSentence,
            isValid: null,
          })
        )

        return {
          ...state,
          [locale]: {
            ...currentLocaleState,
            pendingSentences,
            isLoadingPendingSentences: false,
          },
        }
      }

      case ActionType.VOTE_SENTENCE: {
        const pendingSentences = currentLocaleState.pendingSentences.map(
          (pendingSentence, index) =>
            index === action.sentenceIndex
              ? { ...pendingSentence, isValid: action.isValid }
              : pendingSentence
        )

        return {
          ...state,
          [locale]: {
            ...currentLocaleState,
            pendingSentences,
          },
        }
      }

      case ActionType.SHOW_NEXT_SENTENCE: {
        const pendingSentences = currentLocaleState.pendingSentences.filter(
          sentence => sentence.sentenceId !== action.sentenceId
        )

        return {
          ...state,
          [locale]: {
            ...currentLocaleState,
            pendingSentences,
          },
        }
      }

      case ActionType.SET_BULK_UPLOAD_STATUS: {
        return {
          ...state,
          [locale]: {
            ...currentLocaleState,
            bulkUploadStatus: action.bulkUploadStatus,
          },
        }
      }

      default:
        return state
    }
  }

  const localeSentences = ({ locale, sentences }: StateTree) => {
    if (!sentences[locale]) {
      return DEFAULT_LOCALE_STATE
    }

    return sentences[locale]
  }

  export const selectors = {
    localeSentences,
  }
}
