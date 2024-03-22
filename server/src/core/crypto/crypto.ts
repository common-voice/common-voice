import * as crypto from 'crypto'

export const createMd5Hash = (data: string) =>
  crypto.createHash('md5').update(data).digest('hex')

export const createHash = (hashAlgo: string) => (data: string) =>
  crypto.createHash(hashAlgo).update(data).digest('hex')
