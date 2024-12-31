import { ValidatorRuleError } from '../../core/sentences'
import {
  ApplicationError,
  ApplicationErrorKind,
  BulkSubmissionErrorKind,
  DatasetErrorKind,
  PresentableApplicationError,
  SentenceValidationErrorKind,
} from '../types/error'

export const createError =
  (kind: ApplicationErrorKind) => (message: string, error?: Error) => ({
    kind,
    message,
    error: error ? error : new Error(message),
  })

export const createValidationError = createError('Validation')

export const createBulkSubmissionError = createError(BulkSubmissionErrorKind)
export const createDatasetError = createError(DatasetErrorKind)

export const createSentenceValidationError = (
  err: ValidatorRuleError
): ApplicationError => {
  return {
    ...createError(SentenceValidationErrorKind)(err.error),
    errorType: err.errorType,
  }
}

export const createSentenceRepositoryError = createError(
  'SentenceRepository'
)
export const createDatabaseError = createError('DatabaseError')

export const createPresentableError = (
  err: ApplicationError
): PresentableApplicationError => {
  const { error, ...presentableErr } = err
  return presentableErr
}
