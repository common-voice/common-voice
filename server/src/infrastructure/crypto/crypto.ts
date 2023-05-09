import * as crypto from 'crypto'
import { Readable } from 'stream'

export const createMd5HashFromStream = async (readStream: Readable): Promise<string> => {
  const hash = crypto.createHash('md5')

  for await (const chunk of readStream) {
    hash.update(chunk)
  }

  return hash.digest('hex')
}

export const createMd5Hash = (data: string) => crypto.createHash('md5').update(data).digest('hex')
