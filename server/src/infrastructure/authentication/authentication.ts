import { Environment } from '../../config-helper'

export const CALLBACK_URL = '/callback'

const CALLBACK_MAP: Readonly<Record<Environment, string>> = {
  stage: 'https://commonvoice.allizom.org',
  prod: 'https://commonvoice.mozilla.org',
  sandbox: 'https://sandbox.commonvoice.allizom.org',
  local: 'http://localhost:9000', // TODO: use SERVER_PORT
}

export const callbackURL = (env: Environment) =>
  CALLBACK_MAP[env] + CALLBACK_URL
