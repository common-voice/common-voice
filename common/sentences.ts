import { SentenceDomain } from './taxonomies'

export type SentenceSubmission = {
  sentence: string
  source: string
  localeId: number
  localeName: string
  domain?: SentenceDomain
}

export enum SentenceSubmissionError {
  TOO_LONG = 'TOO_LONG',
  NO_NUMBERS = 'NO_NUMBERS',
  NO_SYMBOLS = 'NO_SYMBOLS',
  NO_ABBREVIATIONS = 'NO_ABBREVIATIONS',
  NO_FOREIGN_SCRIPT = 'NO_FOREIGN_SCRIPT',
  NO_CITATION = 'NO_CITATION',
  OTHER = 'NO_FOREIGN_SCRIPT',
}

export type PendingSentence = {
  sentenceId: string
  sentence: string
  source: string
  localeId: number
  isValid: boolean
}

export type SentenceVote = {
  vote: boolean
  sentence_id: string
  sentenceIndex: number
}

export type BulkUploadStatus =
  | 'off'
  | 'waiting'
  | 'uploading'
  | 'done'
  | 'error'
