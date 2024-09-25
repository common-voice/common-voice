import { SentenceSubmissionError } from 'common'

export type SentenceWriteState = {
  sentence: string
  citation: string
  sentenceDomains: string[]
  sentenceVariant?: string
  error: SentenceSubmissionError
  confirmPublicDomain: boolean
}

export type SmallBatchResponse = {
  message: string
  total_count: number
  valid_sentences_count: number
  invalid_sentences_count: number
  invalid_sentences: { sentence: string; errorType: string }[]
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

export type SetPublicDomainAction = {
  type: SentenceWriteActionType.SET_PUBLIC_DOMAIN
}

export type SetSentenceAction = {
  type: SentenceWriteActionType.SET_SENTENCE
  payload: { sentence: string }
}

export type SetCitationAction = {
  type: SentenceWriteActionType.SET_CITATION
  payload: { citation: string }
}

export type SetSingleSentenceDomain = {
  type: SentenceWriteActionType.SET_DOMAIN
  payload: { sentenceDomains: string[] }
}

export type SetSentenceVariant = {
  type: SentenceWriteActionType.SET_VARIANT
  payload: { sentenceVariant: string }
}

export type AddSentenceSuccessAction = {
  type: SentenceWriteActionType.ADD_SENTENCE_SUCCESS
}

export type AddSentenceErrorAction = {
  type: SentenceWriteActionType.ADD_SENTENCE_ERROR
  payload: { error: SentenceSubmissionError }
}

export type SentenceWriteActions =
  | SetPublicDomainAction
  | SetSentenceAction
  | SetCitationAction
  | AddSentenceSuccessAction
  | AddSentenceErrorAction
  | SetSingleSentenceDomain
  | SetSentenceVariant
