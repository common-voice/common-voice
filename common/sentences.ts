export type SentenceSubmission = {
  sentence: string
  source: string
  localeId: number
  localeName: string
}

export enum SentenceSubmissionError {
  TOO_LONG = 'TOO_LONG',
  NO_NUMBERS = 'NO_NUMBERS',
  NO_SYMBOLS = 'NO_SYMBOLS',
  NO_ABBREVIATIONS = 'NO_ABBREVIATIONS',
  NO_FOREIGN_SCRIPT = 'NO_FOREIGN_SCRIPT',
  OTHER = 'NO_FOREIGN_SCRIPT',
}
