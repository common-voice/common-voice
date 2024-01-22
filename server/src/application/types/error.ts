import { ValidatorRuleErrorType } from '../../core/sentences'

export const SentencesRepositoryErrorKind = 'SentencesRepository'
export const SentenceValidationErrorKind = 'SentenceValidation'
export const ValidationErrorKind = 'Validation'
export const DatabaseErrorKind = 'DatabaseError'
export const BulkSubmissionErrorKind = 'BulkSubmissionError'
export const DatasetErrorKind = 'DatasetError'
export const OtherErrorKind = 'Other'

export const ApplicationErrorKinds = [
  ValidationErrorKind,
  SentencesRepositoryErrorKind,
  SentenceValidationErrorKind,
  DatabaseErrorKind,
  BulkSubmissionErrorKind,
  DatasetErrorKind,
  OtherErrorKind,
] as const

export type ApplicationErrorKind = typeof ApplicationErrorKinds[number]

export type ApplicationError = BaseError | SentenceValidationError

export type BaseError = {
  kind: ApplicationErrorKind
  message: string
  error: Error
}

export type SentenceValidationError = BaseError & {
  errorType: ValidatorRuleErrorType
}

// We don't want to show the stack trace or the specific error to
// clients for security reasons.
export type PresentableBaseError = {
  kind: ApplicationErrorKind
  message: string
}

export type PresentableSentenceValidationError = PresentableBaseError & {
  errorType: ValidatorRuleErrorType
}

export type PresentableApplicationError =
  | PresentableBaseError
  | PresentableSentenceValidationError
