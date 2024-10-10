export type SentenceSubmission = {
  source: string
  localeName: string
  sentence: string
  domains: string[]
  variant?: string
}

export enum SentenceSubmissionError {
  TOO_LONG = 'TOO_LONG',
  NO_NUMBERS = 'NO_NUMBERS',
  NO_SYMBOLS = 'NO_SYMBOLS',
  NO_ABBREVIATIONS = 'NO_ABBREVIATIONS',
  NO_FOREIGN_SCRIPT = 'NO_FOREIGN_SCRIPT',
  NO_CITATION = 'NO_CITATION',
  MULTIPLE_SENTENCES = 'MULTIPLE_SENTENCES',
  EXCEEDS_SMALL_BATCH_LIMIT = 'EXCEEDS_SMALL_BATCH_LIMIT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  REQUEST_ERROR = 'REQUEST_ERROR',
  OTHER = 'NO_FOREIGN_SCRIPT',
}

export type PendingSentence = {
  sentenceId: string
  sentence: string
  source: string
  localeId: number
  isValid: boolean
  variantTag: string
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
