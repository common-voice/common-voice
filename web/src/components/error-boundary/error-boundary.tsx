import * as React from 'react';

import URLS from '../../urls';
import LogoImage from '../ui/logo-image/logo-image';
import Page from '../ui/page';
import PageHeading from '../ui/page-heading';
import PageTextContent from '../ui/page-text-content';
import catchErrorsWithSentry from './catch-errors-with-sentry';

import './error-boundary.css';

interface Props {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<Props> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async componentDidCatch(error: Error, errorInfo: any) {
    catchErrorsWithSentry(error, errorInfo);
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      /* 
        This is intentionally not localized, at this point we
        do not know what locale the user has so we will serve
        just English
      */

      return (
        <div className="ErrorBoundary">
          <Page isCentered>
            <LogoImage />

            <PageHeading>Something went wrong</PageHeading>

            <PageTextContent>
              <p>Please try again later...</p>
              <a href={URLS.ROOT}>Go to the homepage</a>
            </PageTextContent>
          </Page>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
