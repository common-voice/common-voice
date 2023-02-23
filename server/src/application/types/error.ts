export const PendingSentencesRepositoryErrorKind = 'PendingSentencesRepository'
export const PendingSentenceValidationKind = 'PendingSentenceValidation'
export const ValidationKind = 'Validation'
export const Other = 'Other'

export const ApplicationErrorKinds = [
  ValidationKind,
  PendingSentencesRepositoryErrorKind,
  PendingSentenceValidationKind,
  Other,
] as const

export type ApplicationErrorKind = typeof ApplicationErrorKinds[number]

export type ApplicationError = {
  kind: ApplicationErrorKind
  message: string
  error: Error
}

// We don't want to show the stack trace or the specific error to
// clients for security reasons.
export type PresentableApplicationError = {
  kind: ApplicationErrorKind
  message: string
}
