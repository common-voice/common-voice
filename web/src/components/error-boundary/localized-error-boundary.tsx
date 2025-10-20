import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

import Layout from '../layout/layout'
import ErrorPage from '../pages/error-page/error-page'
import {
  SystemError,
  ClientHandledError,
  ERROR_BOUNDARY_CODES,
  ErrorBoundaryErrorCode,
} from '../../services/app-error'

import catchErrorsWithSentry from './catch-errors-with-sentry'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props extends RouteComponentProps<any, any, any> {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  errorCode?: ErrorBoundaryErrorCode
}

class LocalizedErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error) {
    const errorCode = LocalizedErrorBoundary.getErrorCodeFromError(error)
    if (errorCode) {
      return { hasError: true, errorCode }
    }
    // For client-handled errors, do not set hasError
    return null
  }

  /**
   * Determines which system errors should trigger the Error Boundary
   * Client-handled errors are ignored and handled by components
   */
  private static getErrorCodeFromError(
    error: Error
  ): ErrorBoundaryErrorCode | undefined {
    // Never trigger error boundary for expected client-handled errors
    if (error instanceof ClientHandledError) {
      // These should be handled gracefully by components
      // Log to Sentry but don't show system error page
      return undefined
    }

    // Use the specific code from SystemError instances
    if (error instanceof SystemError) {
      return ERROR_BOUNDARY_CODES.includes(error.code) ? error.code : '500'
    }

    // Detect network-related infrastructure failures
    if (
      error.message.includes('Network Error') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('Network request failed') ||
      error.name === 'TypeError'
    ) {
      return '502'
    }

    // Detect timeout infrastructure failures
    if (
      error.message.includes('timeout') ||
      error.message.includes('Timeout') ||
      error.name === 'TimeoutError'
    ) {
      return '504'
    }

    // Default to internal server error for unexpected system failures
    return '500'
  }

  async componentDidCatch(error: Error, errorInfo: any) {
    // Only log system errors and unexpected errors to Sentry
    // Client-handled errors are expected application flow
    if (!(error instanceof ClientHandledError)) {
      catchErrorsWithSentry(error, errorInfo)
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { pathname } = this.props.location
    const hasPathnameChanged = pathname !== prevProps.location.pathname

    // Reset error state when navigating to a new page
    if (hasPathnameChanged) {
      this.setState({ hasError: false, errorCode: undefined })
    }
  }

  render() {
    const { children, location } = this.props
    const { hasError, errorCode } = this.state

    // Only show error page for system failures, not client-handled errors
    if (hasError && errorCode) {
      return (
        <Layout>
          <ErrorPage
            errorCode={errorCode}
            prevPath={location.state?.prevPath}
          />
        </Layout>
      )
    }

    return children
  }
}

export default withRouter(LocalizedErrorBoundary)
