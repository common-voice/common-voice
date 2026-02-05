//
// Client Handled Errors - Expected application states handled gracefully in components
// These represent normal business logic flows like validation, auth, and resource issues
//
export class ClientHandledError extends Error {
  constructor(
    message: string,
    public status: number,
    public retryAfter?: string,
    public originalError?: Error
  ) {
    super(message)
    this.name = 'ClientHandledError'
  }
}

export class UnauthorizedError extends ClientHandledError {
  constructor(message = 'Unauthorized') {
    super(message, 401)
    this.name = 'UnauthorizedError'
  }
}

export class NotFoundError extends ClientHandledError {
  constructor(message = 'Not Found') {
    super(message, 404)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends ClientHandledError {
  constructor(message = 'Conflict') {
    super(message, 409)
    this.name = 'ConflictError'
  }
}

export class RateLimitError extends ClientHandledError {
  constructor(retryAfter?: string) {
    super('Too Many Requests', 429, retryAfter)
    this.name = 'RateLimitError'
  }
}

export class BusinessLogicError extends ClientHandledError {
  constructor(message: string, status = 400) {
    super(message, status)
    this.name = 'BusinessLogicError'
  }
}

//
// System Errors - Unexpected infrastructure failures that trigger Error Boundary
// These represent server crashes, network partitions, and system outages
//
export class SystemError extends Error {
  constructor(
    message: string,
    public code: ErrorBoundaryErrorCode = '500',
    public originalError?: Error
  ) {
    super(message)
    this.name = 'SystemError'

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SystemError)
    }
  }
}

// Factory functions for specific system failure types
export const createInternalServerError = (message = 'Internal server error') =>
  new SystemError(message, '500')

export const createBadGatewayError = (message = 'Bad gateway') =>
  new SystemError(message, '502')

export const createServiceUnavailableError = (
  message = 'Service unavailable'
) => new SystemError(message, '503')

export const createGatewayTimeoutError = (message = 'Gateway timeout') =>
  new SystemError(message, '504')

// Error code classifications
export const CLIENT_HANDLED_ERROR_CODES = ['401', '404', '409', '429'] as const
export const ERROR_BOUNDARY_CODES = ['500', '502', '503', '504'] as const

export type ClientHandledErrorCode = typeof CLIENT_HANDLED_ERROR_CODES[number]
export type ErrorBoundaryErrorCode = typeof ERROR_BOUNDARY_CODES[number]
export type HandledErrorCode = ClientHandledErrorCode | ErrorBoundaryErrorCode
