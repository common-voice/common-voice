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

export type ApplicationError = BasicError | SentenceValidationError

export type BasicError = {
  kind: ApplicationErrorKind
  message: string
  error: Error
}

export type SentenceValidationError = BasicError & {
  errorType: ValidatorRuleErrorType
}

// We don't want to show the stack trace or the specific error to
// clients for security reasons.
export type PresentableApplicationError = {
  kind: ApplicationErrorKind
  message: string,
  errorType?: ValidatorRuleErrorType
}
