import { Environment, getConfig } from '../../config-helper'

export const CALLBACK_URL = '/callback'

export const COMMON_VOICE_DOMAIN_MAP: Readonly<Record<Environment, string>> = {
  prod: 'https://commonvoice.mozilla.org',
  stage: 'https://commonvoice.allizom.org',
  sandbox: 'https://sandbox.commonvoice.allizom.org',
  local: 'http://localhost:9000', // TODO: use SERVER_PORT
}

export const callbackURL = (env: Environment) =>
  COMMON_VOICE_DOMAIN_MAP[env] + CALLBACK_URL

export type CreateClientCredentialsResponse = {
  userId: string
  clientId: string
  clientSecret: string
  description: string
  permissions: ClientCredentialsPermission[]
}

export type ClientCredentialsPermission = {
  permission_id: number
  name: string
  description: string
}

export const createClientCredentials = async (clientInfo: {
  userId: string
  description: string
  permissions: string[]
}): Promise<CreateClientCredentialsResponse> => {
  const res = await fetch(
    getConfig().AUTH_SERVICE_URL + '/internal/auth/clients',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientInfo),
    }
  )

  if (!res.ok) {
    throw new Error(`Failed to create client credentials: ${res.status}`)
  }

  const data = await res.json()

  return data
}

export const getClientCredentials = async (clientInfo: { userId: string }) => {
  const res = await fetch(
    getConfig().AUTH_SERVICE_URL +
    `/internal/auth/clients?userId=${encodeURIComponent(clientInfo.userId)}`
  )

  if (!res.ok) {
    throw new Error(`Failed to retrieve client credentials: ${res.status}`)
  }

  const data = await res.json()

  return data
}

export const deleteClientCredentials = async (clientInfo: { clientId: string }) => {
  const res = await fetch(
    getConfig().AUTH_SERVICE_URL +
    `/internal/auth/clients/${encodeURIComponent(clientInfo.clientId)}`,
    {
      method: 'DELETE',
    }
  )

  if (!res.ok) {
    throw new Error(`Failed to delete client credentials: ${res.status}`)
  }
}
