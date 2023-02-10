export const ScSentenceRepositoryErrorKind = 'ScSentenceRepository'
export const ScSentenceValidationKind = 'ScSentenceValidation'
export const ValidationKind = 'Validation'
export const Other = 'Other'

export const ApplicationErrorKinds = [
  ValidationKind,
  ScSentenceRepositoryErrorKind,
  ScSentenceValidationKind,
  Other,
] as const

export type ApplicationErrorKind = typeof ApplicationErrorKinds[number]

export type ApplicationError = {
  kind: ApplicationErrorKind
  message: string
  error: Error
}
