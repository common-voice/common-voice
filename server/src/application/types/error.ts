import { ValidatorRuleErrorType } from '../../core/sentences'

export const SentencesRepositoryErrorKind = 'SentencesRepository'
export const SentenceValidationKind = 'SentenceValidation'
export const ValidationKind = 'Validation'
export const DatabaseError = 'DatabaseError'
export const Other = 'Other'

export const ApplicationErrorKinds = [
  ValidationKind,
  SentencesRepositoryErrorKind,
  SentenceValidationKind,
  DatabaseError,
  Other,
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
