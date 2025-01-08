import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'
import { getConfig } from './config-helper'

const { RELEASE_VERSION, SENTRY_DSN_SERVER, PROD } = getConfig()

Sentry.init({
  // no SENTRY_DSN_SERVER is set in development
  dsn: SENTRY_DSN_SERVER,
  integrations: [nodeProfilingIntegration()],
  environment: PROD ? 'prod' : 'stage',
  release: RELEASE_VERSION,
})
