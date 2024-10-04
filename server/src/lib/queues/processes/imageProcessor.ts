import { Job } from 'bull'
import UserClient from '../../model/user-client'
import { getConfig } from '../../../config-helper'
import {
  deleteFileFromBucket,
  getPublicUrlFromBucket,
  makePublicInBucket,
  uploadToBucket,
} from '../../../infrastructure/storage/storage'
import { constVoid, pipe } from 'fp-ts/lib/function'
import { taskEither as TE, task as T } from 'fp-ts'

const deleteAvatar = async (client_id: string, url: string) => {
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

const updateAvatarURL = async (
  client_id: string,
  user: { client_id: string; email: string },
  uploadedImagePath: string
) => {
  const oldAvatar = await UserClient.updateAvatarURL(
    user.email,
    uploadedImagePath
  )
  if (oldAvatar) await deleteAvatar(client_id, oldAvatar)
}

const imageProcessor = async (job: Job) => {
  const {
    client_id,
    rawImageData,
    key: fileName,
    imageBucket,
    user,
  } = job.data as {
    client_id: string
    rawImageData: string
    user: { client_id: string; email: string }
    key: string
    imageBucket: string
  }

  const imageBuffer = Buffer.from(rawImageData, 'binary')
  //upload to S3 here
  try {
    await pipe(
      TE.Do,
      TE.bind('upload', () =>
        uploadToBucket(imageBucket)(fileName)(imageBuffer)
      ),
      TE.bind('makePublic', () => makePublicInBucket(imageBucket)(fileName)),
      TE.map(constVoid),
      TE.getOrElse((e: Error) => T.of(console.log(e)))
    )()

    const avatarURL = getPublicUrlFromBucket(imageBucket)(fileName)

    await updateAvatarURL(client_id, user, avatarURL)
  } catch (error) {
    console.error(error)
    return false
  }
  return true
}

export default imageProcessor
