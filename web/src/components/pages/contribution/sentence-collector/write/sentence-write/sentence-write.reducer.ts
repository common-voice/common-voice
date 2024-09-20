import { SentenceSubmissionError } from 'common'

export type SentenceWriteState = {
  sentence: string
  citation: string
  sentenceDomains: string[]
  sentenceVariant?: string
  error: SentenceSubmissionError
  confirmPublicDomain: boolean
}

export enum SentenceWriteActionType {
  SET_PUBLIC_DOMAIN = 'SET_PUBLIC_DOMAIN',
  SET_SENTENCE = 'SET_SENTENCE',
  SET_CITATION = 'SET_CITATION',
  SET_DOMAIN = 'SET_SENTENCE_DOMAIN',
  SET_VARIANT = 'SET_SENTENCE_VARIANT',
  ADD_SENTENCE_SUCCESS = 'ADD_SENTENCE_SUCCESS',
  ADD_SENTENCE_ERROR = 'ADD_SENTENCE_ERROR',
}

type SetPublicDomainAction = {
  type: SentenceWriteActionType.SET_PUBLIC_DOMAIN
}

type SetSentenceAction = {
  type: SentenceWriteActionType.SET_SENTENCE
  payload: { sentence: string }
}

type SetCitationAction = {
  type: SentenceWriteActionType.SET_CITATION
  payload: { citation: string }
}

type SetSingleSentenceDomain = {
  type: SentenceWriteActionType.SET_DOMAIN
  payload: { sentenceDomains: string[] }
}

type SetSentenceVariant = {
  type: SentenceWriteActionType.SET_VARIANT
  payload: { sentenceVariant: string }
}

type AddSentenceSuccessAction = {
  type: SentenceWriteActionType.ADD_SENTENCE_SUCCESS
}

type AddSentenceErrorAction = {
  type: SentenceWriteActionType.ADD_SENTENCE_ERROR
  payload: { error: SentenceSubmissionError }
}

type Action =
  | SetPublicDomainAction
  | SetSentenceAction
  | SetCitationAction
  | AddSentenceSuccessAction
  | AddSentenceErrorAction
  | SetSingleSentenceDomain
  | SetSentenceVariant

export const sentenceWriteReducer = (
  state: SentenceWriteState,
  action: Action
) => {
  switch (action.type) {
    case SentenceWriteActionType.SET_PUBLIC_DOMAIN:
      return {
        ...state,
        confirmPublicDomain: !state.confirmPublicDomain,
      }

    case SentenceWriteActionType.SET_SENTENCE:
      return {
        ...state,
        sentence: action.payload.sentence,
      }

    case SentenceWriteActionType.SET_CITATION:
      return {
        ...state,
        citation: action.payload.citation,
      }

    case SentenceWriteActionType.SET_DOMAIN:
      return {
        ...state,
        sentenceDomains: [...action.payload.sentenceDomains],
      }

    case SentenceWriteActionType.SET_VARIANT:
      return {
        ...state,
        sentenceVariant: action.payload.sentenceVariant,
      }

    case SentenceWriteActionType.ADD_SENTENCE_SUCCESS:
      return {
        ...state,
        sentence: '',
        citation: '',
        confirmPublicDomain: false,
        sentenceDomains: [],
        sentenceVariant: '',
        error: undefined,
      }

    case SentenceWriteActionType.ADD_SENTENCE_ERROR:
      return {
        ...state,
        error: action.payload.error,
      }
  }
}
