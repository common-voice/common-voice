import * as Sentry from '@sentry/react';

import { isProduction, isStaging } from '../../utility';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function catchErrorsWithSentry(error: Error, errorInfo: any) {
  // don't log errors in development
  if (!isProduction() && !isStaging()) {
    return;
  }

  Sentry.withScope(scope => {
    Object.keys(errorInfo).forEach(key => {
      scope.setExtra(key, errorInfo[key]);
    });
    Sentry.captureException(error);
  });
}
