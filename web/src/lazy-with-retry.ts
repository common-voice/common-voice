import * as React from 'react'

const RETRY_COUNT = 2
const RETRY_DELAY_MS = 1500

/**
 * Wraps a dynamic import with retry logic for transient network failures.
 * After retries are exhausted, the error propagates to the error boundary
 * which handles stale-chunk detection and page reload.
 */
export default function lazyWithRetry<
  T extends React.ComponentType<any> // eslint-disable-line @typescript-eslint/no-explicit-any
>(importFn: () => Promise<{ default: T }>): React.LazyExoticComponent<T> {
  return React.lazy(() => retryImport(importFn, RETRY_COUNT))
}

function retryImport<T>(
  importFn: () => Promise<{ default: T }>,
  retriesLeft: number
): Promise<{ default: T }> {
  return importFn().catch((error: Error) => {
    if (retriesLeft <= 0) throw error
    return new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS)).then(
      () => retryImport(importFn, retriesLeft - 1)
    )
  })
}
