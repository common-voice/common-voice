import { program } from 'commander'
import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import { query } from '../infrastructure/database'
import { Readable } from 'node:stream'
import {
  getMetadataFromFile,
  streamDownloadFileFromBucket,
} from '../infrastructure/storage'
import { getClipsBucketName } from '../config/config'
const mp3Duration = require('mp3-duration')

type Clip = { id: number; path: string; duration: number }
const BATCH_SIZE = 100
const findClipsWithoutDurationQuery = `
  SELECT id, path, duration FROM clips WHERE duration = 0 LIMIT ?
`
const findClipsWithoutDuration = (limit: number) =>
  pipe(query<[Clip]>(findClipsWithoutDurationQuery, [limit]))

const findTotalClipsWithoutDurationQuery = `
  SELECT COUNT(*) as num_of_clips FROM clips WHERE duration = 0
`

const findTotalClipsCountWithoutDuration = pipe(
  query<[{ num_of_clips: number }]>(findTotalClipsWithoutDurationQuery, []),
  TE.map(arr => arr.shift()?.num_of_clips || 0),
)

const updateClipDurationQuery = `
  UPDATE clips SET duration = ? WHERE id = ?
`

const updateClipDuration = (id: number, duration: number) =>
  pipe(query(updateClipDurationQuery, [duration, id]))

const nextClips = async (count: number) =>
  pipe(
    findClipsWithoutDuration(count),
    TE.match(
      err => {
        console.log(err)
        return [] as Clip[]
      },
      res => res,
    ),
  )()

const calculateDurations = async (options: any) => {
  const MAX = options.total || 1000
  const total = await pipe(
    findTotalClipsCountWithoutDuration,
    TE.getOrElse(() => T.of(0)),
  )()
  const damagedClips: string[] = []
  console.log(
    `There are a total of ${total} of clips without duration. Processing ${MAX} clip(s)`,
  )

  let progress = 0
  let batch = await nextClips(BATCH_SIZE)

  while (batch.length > 0) {
    if (progress >= total || progress >= options.total) break
    await Promise.all(
      batch.map(async audio => {
        console.log(`Processing ${audio.path}`)
        let durationMs = 0
        try {
          const fileSize = await pipe(
            getMetadataFromFile(getClipsBucketName())(audio.path),
            TE.map(metadata => Number(metadata.size)),
            TE.getOrElse(() => T.of(0)),
          )()

          if (fileSize <= 256) {
            damagedClips.push(audio.path)
          } else {
            const stream = streamDownloadFileFromBucket(getClipsBucketName())(
              audio.path,
            )
            const buffer = await gatherBuffer(stream)
            durationMs = (await mp3Duration(buffer)) * 1000
            await updateClipDuration(audio.id, durationMs)()
          }
        } catch (err) {
          damagedClips.push(audio.path)
          console.log(err)
        }

        return {
          ...audio,
          durationMs,
        }
      }),
    )
    progress += batch.length
    console.log(`Progress: ${progress}/${MAX}`)
    batch = await nextClips(BATCH_SIZE)

    await sleep(1000)
  }
  console.log('Damaged audios:\n', damagedClips.join('\n'))
}

function gatherBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((res, rej) => {
    const chunks: any = []
    stream.on('data', data => chunks.push(data))
    stream.on('close', () => {
      res(Buffer.concat(chunks))
    })
    stream.on('error', err => rej(err))
  })
}

const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

program
  .name('calculateDurations.js')
  .option(
    '-t, --total <number>',
    'the total number of clips that should be processed',
  )
  .description('calculate duration for clips')
  .action(calculateDurations)

program.parse()
