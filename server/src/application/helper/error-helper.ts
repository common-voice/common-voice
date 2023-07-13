import { ValidatorRuleError } from '../../core/sentences'
import {
  ApplicationError,
  ApplicationErrorKind,
  PresentableApplicationError,
  SentenceValidationKind,
} from '../types/error'

export const createError =
  (kind: ApplicationErrorKind) => (message: string, error?: Error) => ({
    kind,
    message,
    error: error ? error : new Error(message),
  })

export const createValidationError = createError('Validation')

export const createSentenceValidationError = (
  err: ValidatorRuleError
): ApplicationError => {
  return {
    ...createError(SentenceValidationKind)(err.error),
    errorType: err.errorType,
  }
}

export const createPendingSentencesRepositoryError = createError(
  'SentencesRepository'
)
export const createDatabaseError = createError('DatabaseError')

export const createPresentableError = (
  err: ApplicationError
): PresentableApplicationError => {
  const { error, ...presentableErr } = err
  return presentableErr
}
