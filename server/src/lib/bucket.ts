import { getConfig } from '../config-helper'
import Model from './model'
import { Clip, TakeoutRequest } from 'common'
import { PassThrough } from 'stream'
import { ClientClip } from './takeout'
import * as Sentry from '@sentry/node'
import { pipe } from 'fp-ts/lib/function'
import {
  Metadata,
  deleteFileFromBucket,
  doesFileExistInBucket,
  downloadFileFromBucket,
  getMetadataFromFile,
  getPublicUrlFromBucket,
  getSignedUrlFromBucket,
  streamUploadToBucket,
  uploadToBucket,
} from '../infrastructure/storage/storage'
import { task as T, taskEither as TE } from 'fp-ts'
import * as archiver from 'archiver'
import { zip } from 'fp-ts/lib/ReadonlyArray'

/**
 * Bucket
 *   The bucket class is responsible for loading clip
 *   metadata into the Model from s3.
 */
export default class Bucket {
  private model: Model

  constructor(model: Model) {
    this.model = model
  }

  /**
   * Fetch a public url for the resource.
   */
  public async getPublicUrl(key: string, bucketType?: string): Promise<string> {
    const { DATASET_BUCKET_NAME, CLIP_BUCKET_NAME, ENVIRONMENT } = getConfig()

    const bucket =
      bucketType === 'dataset' ? DATASET_BUCKET_NAME : CLIP_BUCKET_NAME

    if (ENVIRONMENT === 'local') {
      return `http://localhost:8080/storage/v1/b/${bucket}/o/${key}?alt=media`
    }

    const url = await pipe(
      getSignedUrlFromBucket(bucket)(key),
      TE.getOrElse(() => T.of(`Cannot get signed url for ${key}`))
    )()

    return url
  }

  /**
   * Construct the public URL for a resource that needs no token
   */
  public getUnsignedUrl(bucket: string, key: string) {
    return getPublicUrlFromBucket(bucket)(key)
  }

  /**
   * Delete function for S3 used for removing old avatars
   */
  public async deleteAvatar(client_id: string, url: string) {
    const urlParts = url.split('/')
    if (urlParts.length) {
      const fileName = urlParts[urlParts.length - 1]

      await pipe(
        deleteFileFromBucket(getConfig().CLIP_BUCKET_NAME)(
          `${client_id}/${fileName}`
        ),
        TE.getOrElse((e: Error) => T.of(console.log(e)))
      )()
    }
  }

  /**
   * Check if given file exists
   */
  async fileExists(path: string): Promise<boolean> {
    return pipe(
      doesFileExistInBucket(getConfig().CLIP_BUCKET_NAME)(path),
      TE.getOrElse(() => T.of(false))
    )()
  }

  /**
   * Grab metadata to play clip on the front end.
   */
  async getRandomClips(
    client_id: string,
    locale: string,
    count: number
  ): Promise<Clip[]> {
    // Get more clip IDs than are required in case some are broken links or clips
    const clips = await this.model.findEligibleClips(
      client_id,
      locale,
      Math.ceil(count * 1.5)
    )
    const clipPromises: Clip[] = []

    Sentry.captureMessage(
      `Got ${clips.length} eligible clips for ${locale} locale`,
      Sentry.Severity.Info
    )

    // Use for instead of .map so that it can break once enough clips are assembled
    for (let i = 0; i < clips.length; i++) {
      const { id, path, sentence, original_sentence_id, taxonomy } = clips[i]

      try {
        const metadata = await pipe(
          getMetadataFromFile(getConfig().CLIP_BUCKET_NAME)(path),
          TE.getOrElse(() => T.of({ size: 0 }))
        )()

        // if the clip is smaller than 256 bytes it is most likely blank and should be skipped
        if (metadata.size >= 256) {
          clipPromises.push({
            id: id.toString(),
            glob: path.replace('.mp3', ''),
            sentence: { id: original_sentence_id, text: sentence, taxonomy },
            audioSrc: await this.getPublicUrl(path),
          })
        } else {
          console.log(`clip_id ${id} at ${path} is smaller than 256 bytes`)
          await this.model.db.markInvalid(id.toString())
        }

        // this will break either when 10 clips have been retrieved or when 15 have been tried
        // as long as at least 1 clip is returned, the next time the cache refills it will try
        // for another 15
        if (clipPromises.length == count) break
      } catch (e) {
        console.log(e.message)
        console.log(`Storage error retrieving clip_id ${id}`)
        await this.model.db.markInvalid(id.toString())
      }
    }
    Sentry.captureMessage(
      `Having a total of ${clipPromises.length} clips for ${locale} locale`,
      Sentry.Severity.Info
    )
    return Promise.all(clipPromises)
  }

  takeoutKey(takeout: TakeoutRequest, chunkIndex: number): string {
    return `${takeout.client_id}/takeouts/${takeout.id}/takeout_${takeout.id}_pt_${chunkIndex}.zip`
  }

  metadataKey(takeout: TakeoutRequest): string {
    return `${takeout.client_id}/takeouts/${takeout.id}/takeout_${takeout.id}_metadata.txt`
  }

  async zipTakeoutFilesToS3(
    takeout: TakeoutRequest,
    chunkIndex: number,
    paths: string[]
  ): Promise<Metadata> {
    const destination = this.takeoutKey(takeout, chunkIndex)

    console.log('start takeout zipping', destination)

    const bucket = getConfig().CLIP_BUCKET_NAME
    const passThrough = new PassThrough()
    const archive = archiver('zip', { zlib: { level: 6 } })
    
    archive.pipe(passThrough)

    for (const path of paths) {
      await pipe(
        path,
        downloadFileFromBucket(bucket),
        TE.map(buffer => ({ path, buffer })),
        TE.map(clip =>
          archive.append(clip.buffer, {
            name: `takeout_${takeout.id}_pt_${chunkIndex}/${
              path.split('/').length > 1 ? path.split('/')[1] : path
            }`,
          })
        )
      )()
    }

    archive.finalize()

    // passTrough contains the zipped file
    await pipe(
      streamUploadToBucket(bucket)(destination)(passThrough),
      TE.mapLeft(console.log)
    )()

    return await pipe(
      getMetadataFromFile(bucket)(destination),
      TE.getOrElse(() => T.of({ size: 0 }))
    )()
  }

  async uploadClipMetadata(
    takeout: TakeoutRequest,
    clipData: ClientClip[]
  ): Promise<Metadata> {
    const fields = ['original_sentence_id', 'sentence', 'locale']
    const metadataKey = this.metadataKey(takeout)
    let sentenceData = clipData
      .map((clip: any) => fields.map(field => clip[field]).join('\t'))
      .join('\n')
    sentenceData = `${fields.join('\t')}\n${sentenceData}`
    const bucket = getConfig().CLIP_BUCKET_NAME

    await pipe(
      uploadToBucket(bucket)(metadataKey)(Buffer.from(sentenceData)),
      TE.mapLeft(console.log)
    )()

    return await pipe(
      getMetadataFromFile(bucket)(metadataKey),
      TE.getOrElse(() => T.of({ size: 0 }))
    )()
  }

  getAvatarClipsUrl(path: string) {
    return this.getPublicUrl(path)
  }

  async getClipUrl(id: string): Promise<string> {
    const clip = await this.model.db.findClip(id)
    return clip ? this.getPublicUrl(clip.path) : null
  }

  /**
   * Delete function used for removing old avatars
   */
  public async deletePath(path: string) {
    await pipe(
      deleteFileFromBucket(getConfig().CLIP_BUCKET_NAME)(path),
      TE.mapLeft((err: Error) => console.log(err))
    )()
  }
}
