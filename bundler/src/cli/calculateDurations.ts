import { program } from 'commander'
import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import { query } from '../infrastructure/database'
import { Readable } from 'node:stream'
import { streamDownloadFileFromBucket } from '../infrastructure/storage'
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

const calculateDurations = async (args: any, options: any) => {
  const clips = await pipe(
    findClipsWithoutDuration(BATCH_SIZE),
    TE.match(
      err => {
        console.log(err)
        return [] as Clip[]
      },
      res => res,
    ),
  )()

  const total = await pipe(
    findTotalClipsCountWithoutDuration,
    TE.getOrElse(() => T.of(0)),
  )()
  const damagedClips: string[] = []
  console.log(`Processing ${total} clip(s)`)

  let start = 0
  let end = BATCH_SIZE
  let progress = 0
  let batch = clips.slice(start, end)

  while (batch.length > 0) {
    await Promise.all(
      batch.map(async audio => {
        console.log(`Processing ${audio.path}`)
        let durationMs = 0
        try {
          const stream = streamDownloadFileFromBucket(getClipsBucketName())(
            audio.path,
          )
          const buffer = await gatherBuffer(stream)
          durationMs = (await mp3Duration(buffer)) * 1000
          await updateClipDuration(audio.id, durationMs)()
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
    console.log(`Progress: ${progress}/${total}`)
    start += BATCH_SIZE
    end += BATCH_SIZE
    batch = clips.slice(start, end)

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
  .description('calculate duration for clips')
  .action(calculateDurations)

program.parse()
