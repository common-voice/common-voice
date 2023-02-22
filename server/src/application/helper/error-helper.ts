import { ApplicationErrorKind } from '../types/error'

export const createError =
  (kind: ApplicationErrorKind) => (message: string, error?: Error) => ({
    kind,
    message,
    error: error ? error : new Error(message),
  })

export const createValidationError = createError('Validation')
export const createPendingSentenceValidationError = createError(
  'PendingSentenceValidation'
)
export const createPendingSentencesRepositoryError = createError(
  'PendingSentencesRepository'
)
