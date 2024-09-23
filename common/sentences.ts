export type SentenceSubmission = {
  sentence: string
  source: string
  localeName: string
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
