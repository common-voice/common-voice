import { Environment } from '../../config-helper'

export const CALLBACK_URL = '/callback'

export const COMMON_VOICE_DOMAIN_MAP: Readonly<Record<Environment, string>> = {
  prod: 'https://commonvoice.mozilla.org',
  stage: 'https://commonvoice.allizom.org',
  sandbox: 'https://sandbox.commonvoice.allizom.org',
  local: 'http://localhost:9000', // TODO: use SERVER_PORT
}

export const callbackURL = (env: Environment) =>
  COMMON_VOICE_DOMAIN_MAP[env] + CALLBACK_URL
