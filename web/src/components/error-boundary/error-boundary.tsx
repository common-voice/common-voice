import * as React from 'react'

import URLS from '../../urls'
import LogoImage from '../ui/logo-image/logo-image'
import Page from '../ui/page'
import PageHeading from '../ui/page-heading'
import PageTextContent from '../ui/page-text-content'
import { SystemError, ClientHandledError } from '../../services/app-error'
import catchErrorsWithSentry from './catch-errors-with-sentry'

import './error-boundary.css'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  errorCode?: string
}

class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error) {
    // Only trigger for system errors, not client-handled errors
    if (error instanceof ClientHandledError) {
      return { hasError: false } // Don't trigger boundary
    }

    const errorCode = error instanceof SystemError ? error.code : '500'
    return { hasError: true, errorCode }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async componentDidCatch(error: Error, errorInfo: any) {
    // Only log system errors to Sentry
    if (!(error instanceof ClientHandledError)) {
      catchErrorsWithSentry(error, errorInfo)
    }
  }

  render() {
    const { children } = this.props
    const { hasError, errorCode } = this.state

    if (hasError) {
      const getSystemErrorMessage = () => {
        switch (errorCode) {
          case '502':
            return 'Our services are experiencing connection issues. Please check your internet connection and try again.'
          case '503':
            return 'Our services are temporarily unavailable. We are working to restore service.'
          case '504':
            return 'Our services are taking longer than expected to respond. Please try again.'
          default:
            return 'An unexpected system error occurred. Our team has been notified.'
        }
      }

      const getSystemErrorTitle = () => {
        switch (errorCode) {
          case '502':
            return 'Connection Problem'
          case '503':
            return 'Service Unavailable'
          case '504':
            return 'Request Timeout'
          default:
            return 'System Error'
        }
      }

      return (
        <div className="ErrorBoundary">
          <Page isCentered>
            <LogoImage />

            <PageHeading>{getSystemErrorTitle()}</PageHeading>

            <PageTextContent>
              <p>{getSystemErrorMessage()}</p>
              <a href={URLS.ROOT}>Go to the homepage</a>
            </PageTextContent>
          </Page>
        </div>
      )
    }

    return children
  }
}

export default ErrorBoundary
