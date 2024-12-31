import crypto from 'node:crypto'

export const hashClientId = (clientId: string): string =>
  crypto.createHash('sha512').update(clientId).digest('hex')
