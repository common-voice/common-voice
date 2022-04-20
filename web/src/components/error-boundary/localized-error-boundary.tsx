import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import Layout from '../layout/layout';
import ErrorPage from '../pages/error-page/error-page';

import catchErrorsWithSentry from './catch-errors-with-sentry';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props extends RouteComponentProps<any, any, any> {
  children: React.ReactNode;
}
class LocalizedErrorBoundary extends React.Component<Props> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async componentDidCatch(error: Error, errorInfo: any) {
    catchErrorsWithSentry(error, errorInfo);
  }

  componentDidUpdate(prevProps: Props) {
    const { pathname } = this.props.location;

    const hasPathnameChanged = pathname !== prevProps.location.pathname;

    if (hasPathnameChanged) {
      this.setState({ hasError: false });
    }
  }

  render() {
    const { children, location } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return (
        <Layout>
          <ErrorPage errorCode="503" prevPath={location.state?.prevPath} />
        </Layout>
      );
    }

    return children;
  }
}

export default withRouter(LocalizedErrorBoundary);
