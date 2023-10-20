import fs from 'node:fs'
import path from 'node:path'
import { streamingQuery } from '../infrastructure/database'
import { Transform } from 'node:stream'
import { ClipRow } from '../types'

const writeFileStream = fs.createWriteStream('testStream.txt', {
  encoding: 'utf-8',
})

const transformClips = new Transform({
  transform(chunk: ClipRow, encoding, callback) {
    this.push(JSON.stringify(chunk))
    callback()
  },
  objectMode: true
})

export const fetchAllClipsForLocale = (locale: string) => {
  console.log('Fetching clips for locale', locale)
  const stream = streamingQuery(
    fs.readFileSync(
      path.join(__dirname, '..', '..', 'queries', 'bundleLocale.sql'),
      { encoding: 'utf-8' }
    ),
    ['2023-10-20 00:00:00', locale]
  )

  stream.pipe(transformClips).pipe(writeFileStream)
}

export const createPath = (locale: string, clipId: string) =>
  `common_voice_${locale}_${clipId}.mp3`

