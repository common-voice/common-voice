import { PassThrough } from 'stream'
import * as path from 'path'
import * as bodyParser from 'body-parser'
import { MD5 } from 'crypto-js'
import { NextFunction, Request, Response, Router } from 'express'
import * as sendRequest from 'request-promise-native'
import { StatusCodes } from 'http-status-codes'
import PromiseRouter from 'express-promise-router'
const Transcoder = require('stream-transcoder')

import { Sentence, UserClient as UserClientType } from 'common'
import rateLimiter from './rate-limiter-middleware'
import { authMiddleware } from '../auth-router'
import { getConfig } from '../config-helper'
import Awards from './model/awards'
import CustomGoal from './model/custom-goal'
import getGoals from './model/goals'
import UserClient from './model/user-client'
import * as Basket from './basket'
import Bucket from './bucket'
import Clip from './clip'
import Model from './model'
import { APIError } from './utility'
import Email from './email'
import Challenge from './challenge'
import Takeout from './takeout'
import NotificationQueue, { uploadImage } from './queues/imageQueue'
import {
  option as O,
  array as A,
  task as T,
  taskEither as TE,
  identity as Id,
} from 'fp-ts'

import validate, {
  jobSchema,
  sentenceSchema,
  sendLanguageRequestSchema,
  datasetSchema,
  anonUserMetadataSchema,
} from './validation'
import Statistics from './statistics'
import SentencesRouter from '../api/sentences'
import { reportsRouter } from '../api/reports/routes'
import { pipe } from 'fp-ts/lib/function'
import { streamUploadToBucket } from '../infrastructure/storage/storage'
import { bulkSubmissionsRouter } from '../api/bulk-submissions/routes'
import { datasetRouter } from '../api/datasets/routes'
import { getVariantSentencesToRecordQueryHandler } from '../application/sentences/use-case/query-handler/get-variant-sentences-to-record-query-handler'
import {
  fetchSentenceIdsThatUserInteractedWith,
  findVariantSentences,
} from '../application/repository/sentences-repository'
import { fetchUserClientVariants } from '../application/repository/user-client-variants-repository'
import { getLocaleId } from './model/db'
import { languagesRouter } from '../api/languages/routes'
import { profilesRouter } from '../api/profile/routes'
import { getFolderNames } from '../infrastructure/fs/fp-fs'
import { LOCALES_PATH } from '../application/locales/use-case/query-handler/get-locale-messages-query-handler'
import { isProject } from '../core/types/project'
import { projectSchema } from '../api/languages/validation/project-schema'
import webhooksRouter from '../api/webhooks/routes'

export default class API {
  model: Model
  clip: Clip
  challenge: Challenge
  email: Email
  statistics: Statistics
  private readonly bucket: Bucket
  readonly takeout: Takeout

  constructor(model: Model) {
    this.model = model
    this.clip = new Clip(this.model)
    this.statistics = new Statistics(this.model)
    this.challenge = new Challenge(this.model)
    this.email = new Email()
    this.bucket = new Bucket(this.model)
    this.takeout = new Takeout(this.model.db.mysql, this.bucket)
  }

  getRouter(): Router {
    const router = PromiseRouter()

    router.use(authMiddleware)
    router.use('/webhooks', webhooksRouter)
    router.get('/metrics', (request: Request, response: Response) => {
      response.redirect('/')
    })

    router.get('/golem', (request: Request, response: Response) => {
      response.redirect('/')
    })

    router.get('/job/:jobId', validate({ params: jobSchema }), this.getJob)

    //
    // User & Profile
    //

    router.get('/user_clients', this.getUserClients)
    router.post('/user_clients/:client_id/claim', this.claimUserClient)
    router.get('/user_client', this.getAccount)
    router.patch('/user_client', this.saveAccount)
    router.patch(
      '/anonymous_user',
      validate({ body: anonUserMetadataSchema }),
      // 1 requests per minute per IP address
      rateLimiter('/anonymous_user', { points: 1, duration: 60 }),
      this.saveAnonymousAccountLanguages
    )
    router.post(
      '/user_client/avatar/:type',
      bodyParser.raw({ type: 'image/*', limit: '300kb' }),
      this.saveAvatar
    )
    router.post('/user_client/avatar_clip', this.saveAvatarClip)
    router.get('/user_client/avatar_clip', this.getAvatarClip)
    router.get('/user_client/delete_avatar_clip', this.deleteAvatarClip)
    router.post('/user_client/:locale/goals', this.createCustomGoal)
    router.get('/user_client/goals', this.getGoals)
    router.get('/user_client/:locale/goals', this.getGoals)
    router.post('/user_client/awards/seen', this.seenAwards)
    router.get('/user_client/takeout', this.getTakeouts)
    router.post('/user_client/takeout/request', this.requestTakeout)
    router.post('/user_client/takeout/:id/links', this.getTakeoutLinks)

    //
    // Language
    //

    router.get('/language/accents/:locale?', this.getAccents)
    router.get('/language/variants/:locale?', this.getVariants)
    router.post(
      '/language/request',
      // 10 requests per minute
      rateLimiter('/language/request', { points: 10, duration: 60 }),
      validate({ body: sendLanguageRequestSchema }),
      this.sendLanguageRequest
    )
    router.get('/requested_languages', this.getRequestedLanguages)
    router.post('/requested_languages', this.createLanguageRequest)

    router.get(
      '/available_languages',
      validate({ query: projectSchema }),
      this.getAvailableLanguages
    )
    router.get('/languagedata', this.getCombinedLanguageData)
    router.get('/languages', this.getAllLanguages)
    router.use('/languages/:locale', languagesRouter)

    //
    // Sentences
    //
    router.use('/sentences', SentencesRouter)

    router.get(
      '/:locale/sentences',
      validate({ query: sentenceSchema }),
      this.getRandomSentences
    )
    router.post('/skipped_sentences/:id', this.createSkippedSentence)
    router.post('/skipped_clips/:id', this.createSkippedClip)

    //
    // Clips
    //
    router.use('/:locale?/clips', this.clip.getRouter())

    //
    // Statistics & Contribution
    //
    router.use('/statistics', this.statistics.getRouter())

    router.get('/contribution_activity', this.getContributionActivity)
    router.get('/:locale/contribution_activity', this.getContributionActivity)

    router.get('/stats/languages/', this.getLanguageStats)

    //
    // Datasets
    //

    router.get(
      '/datasets',
      validate({ query: datasetSchema }),
      this.getAllDatasets
    )
    router.get('/datasets/languages', this.getAllLanguagesWithDatasets)

    router.use('/datasets/languages', datasetRouter)

    router.post('/newsletter/:email', this.subscribeToNewsletter)

    router.post('/:locale/downloaders', this.insertDownloader)

    router.use('/reports', reportsRouter)

    router.use('/challenge', this.challenge.getRouter())

    router.get('/bucket/:bucket_type/:path', this.getPublicUrl)
    router.get('/server_date', this.getServerDate)

    router.use('/:locale/bulk_submissions', bulkSubmissionsRouter)
    router.use('/profiles', profilesRouter)

    router.use('*', (request: Request, response: Response) => {
      response.sendStatus(404)
    })

    return router
  }

  //
  // Language
  //

  getRequestedLanguages = async (request: Request, response: Response) => {
    response.json(await this.model.db.getRequestedLanguages())
  }

  createLanguageRequest = async (request: Request, response: Response) => {
    const { client_id } = request?.session?.user || {}
    const language = request?.body?.language
    if (!client_id || !language) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }
    await this.model.db.createLanguageRequest(language, client_id)
    response.json({})
  }

  getCombinedLanguageData = async (_request: Request, response: Response) => {
    response.json(await this.model.getCombinedLanguageData())
  }

  getAllLanguages = async (_request: Request, response: Response) => {
    response.json(await this.model.getAllLanguages())
  }

  getAvailableLanguages = async (request: Request, response: Response) => {
    const project = isProject(request?.query?.project)
      ? request.query.project
      : 'common-voice'
    const availableLanguages = getFolderNames(
      path.join(LOCALES_PATH, project)
    )()
    response.json({
      project,
      availableLanguages,
    })
  }

  getAccents = async (request: Request, response: Response) => {
    const client_id = request?.session?.user?.client_id
    if (!client_id) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }
    const locale = request?.params?.locale
    response.json(await this.model.db.getAccents(client_id, locale || null))
  }

  getVariants = async ({ params }: Request, response: Response) => {
    response.json(await this.model.db.getVariants(params?.locale || null))
  }

  sendLanguageRequest = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const body = request?.body
    const { email, languageInfo, languageLocale, platforms } = body
    if (!body || !email || !languageInfo || !languageLocale || !platforms) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }

    try {
      const info = await this.email.sendLanguageRequestEmail({
        email,
        platforms,
        languageInfo,
        languageLocale,
      })

      const json = {
        id: info?.messageId,
        email,
        platforms,
        languageInfo,
        languageLocale,
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any

      if (info?.emailPreviewURL) {
        json.emailPreviewURL = info?.emailPreviewURL
      }

      response.json(json)
    } catch (e) {
      console.error(e)
      next(new Error('Something went wrong sending language request email'))
    }
  }

  //
  // Sentences
  //

  getRandomSentences = async (request: Request, response: Response) => {
    const client_id = request?.session?.user?.client_id
    const locale = request?.params?.locale

    if (!client_id || !locale) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }

    const localeId = await getLocaleId(locale)

    // the validator coerces count into a number but doesn't update the type
    const count: number = parseInt(request?.query?.count as string) || 25
    const ignoreClientVariant: boolean =
      Boolean(request?.query?.ignoreClientVariant) || false

    const userClientVariant = await pipe(
      client_id,
      fetchUserClientVariants,
      TE.map(variants =>
        pipe(
          variants,
          A.findFirst(v => v.localeId == localeId)
        )
      ),
      TE.match(
        err => {
          console.log(err)
          return O.none
        },
        res => res
      )
    )()

    const clientPrefersVariant =
      !ignoreClientVariant &&
      pipe(
        userClientVariant,
        O.map(v => v.isPreferredOption),
        O.getOrElse(() => false)
      )

    if (clientPrefersVariant) {
      const getVariantSentences = pipe(
        getVariantSentencesToRecordQueryHandler,
        Id.ap(fetchSentenceIdsThatUserInteractedWith),
        Id.ap(findVariantSentences)
      )

      const sentences = await pipe(
        userClientVariant,
        O.map(ucv =>
          pipe(
            getVariantSentences({
              clientId: client_id,
              locale: locale,
              variant: ucv.variant,
            })
          )
        ),
        O.getOrElse(() => TE.right([] as Sentence[])),
        TE.match(
          err => {
            console.log(err)
            return [] as Sentence[]
          },
          res => res
        )
      )()

      return response.json(sentences)
    }

    const sentences = await this.model.findEligibleSentences(
      client_id,
      locale,
      count
    )

    response.json(sentences)
  }

  createSkippedSentence = async (request: Request, response: Response) => {
    const client_id = request?.session?.user?.client_id
    const sentence_id = request?.params?.id
    if (!client_id || !sentence_id) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }
    await this.model.db.createSkippedSentence(sentence_id, client_id)
    response.json({})
  }

  //
  // Clips
  //

  createSkippedClip = async (request: Request, response: Response) => {
    const client_id = request?.session?.user?.client_id
    const clip_id = request?.params?.id
    if (!client_id || !clip_id) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }
    await this.model.db.createSkippedClip(clip_id, client_id)
    response.json({})
  }

  //
  // Datasets
  //

  getAllDatasets = async (request: Request, response: Response) => {
    const releaseType = request?.query?.releaseType as string
    if (
      !releaseType ||
      !['singleword', 'delta', 'complete'].includes(releaseType)
    ) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }
    response.json(await this.model.getAllDatasets(releaseType.toString()))
  }

  getLanguageDatasetStats = async (request: Request, response: Response) => {
    const languageCode = request?.params?.languageCode
    if (!languageCode) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }
    response.json(await this.model.getLanguageDatasetStats(languageCode))
  }

  getAllLanguagesWithDatasets = async (
    _request: Request,
    response: Response
  ) => {
    response.json(await this.model.getAllLanguagesWithDatasets())
  }

  //
  // Statistics
  //

  getLanguageStats = async (request: Request, response: Response) => {
    response.json(await this.model.getLanguageStats())
  }

  //
  // Users
  //

  getUserClients = async (request: Request, response: Response) => {
    const user = request?.session?.user
    if (!user) {
      response.json([])
      return
    }
    const email = user.email
    const client_id = user.client_id
    const enrollment = user.enrollment
    const userClients: UserClientType[] = [
      { email, enrollment },
      ...(await UserClient.findAllWithLanguages({
        email,
        client_id,
      })),
    ]
    response.json(userClients)
  }

  /**
   * Allow for anonymous accounts to save metadata related to contributions.
   * Supports accent and variant data.
   *
   * @param {Request} request
   * @param {Response} response
   * @memberof API
   */
  saveAnonymousAccountLanguages = async (
    request: Request,
    response: Response
  ) => {
    const languages = request?.body?.languages
    const client_id = request?.session?.user?.client_id
    if (!client_id || !languages || languages.length === 0) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }
    response
      .status(StatusCodes.CREATED)
      .json(
        await UserClient.saveAnonymousAccountLanguages(client_id, languages)
      )
  }

  saveAccount = async (request: Request, response: Response) => {
    const body = request?.body
    const user = request?.session?.user
    if (!body || !user) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }
    response.json(await UserClient.saveAccount(user.email, body))
  }

  getAccount = async (request: Request, response: Response) => {
    const user = request?.session?.user
    let userData = null
    if (user) {
      userData = await UserClient.findAccount(user.email)
    }

    if (userData !== null && userData.avatar_clip_url !== null) {
      userData.avatar_clip_url = await this.bucket.getAvatarClipsUrl(
        userData.avatar_clip_url
      )
    }

    response.json(user ? userData : null)
  }

  subscribeToNewsletter = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const email = request?.params?.email
      if (!email) {
        return response.sendStatus(StatusCodes.BAD_REQUEST)
      }

      const sourceUrl = request.header('Referer')
      const listUrl =
        process.env.NODE_ENV === 'production'
          ? 'https://abdri3ttkb.execute-api.us-east-2.amazonaws.com/api/newsletter/commonvoicemozillaorg'
          : 'https://kmq73rfvbh.execute-api.us-east-2.amazonaws.com/api/newsletter/commonvoicemozillaorg'

      // Make request to new API
      const listResponse = await fetch(listUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          name: email, // Email because we don't collect
          country: '', // Empty string because we don't collect
          lang: 'en',
          source_url: sourceUrl,
        }),
      })

      console.log(listResponse)

      response.json({ success: true })
    } catch (error) {
      console.error('Newsletter subscription failed:', error)

      // Handle specific error cases
      if (error.statusCode === 400) {
        return response.status(StatusCodes.BAD_REQUEST).json({
          error: 'Invalid email address or missing required fields',
        })
      } else if (error.statusCode === 429) {
        return response.status(StatusCodes.TOO_MANY_REQUESTS).json({
          error: 'Too many subscription attempts',
        })
      } else {
        const apiError = new APIError('Failed to subscribe to newsletter')
        next(apiError)
      }
    }
  }

  saveAvatar = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const body = request?.body
    const params = request?.params
    const user = request?.session?.user
    const client_id = request?.session?.user?.client_id
    if (!body || !params || !user || !client_id) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }
    let avatarURL
    let error
    const { type: imageUploadType } = params
    if (imageUploadType === 'file') {
      const rawImageData = body
      const prefix = (new Date().getUTCMilliseconds() * Math.random())
        .toString(36)
        .slice(-5)
      const fileName = `${client_id}/${prefix}-avatar.jpeg`
      try {
        const bucketName = getConfig().CLIP_BUCKET_NAME
        const job = await uploadImage({
          key: fileName,
          user,
          imageBucket: bucketName,
          client_id,
          rawImageData,
        })

        if (!job) throw new Error('Upload cannot be completed')
        return response.status(StatusCodes.CREATED).json({ id: job.id })
      } catch (error) {
        console.error(error)
        next(
          new APIError(
            error?.message || 'Image could not be uploaded.',
            StatusCodes.BAD_REQUEST
          )
        )
      }
    } else if (params.type === 'default') {
      avatarURL = null
    } else if (params.type === 'gravatar') {
      try {
        avatarURL =
          'https://gravatar.com/avatar/' + MD5(user.email).toString() + '.png'
        await sendRequest(avatarURL + '&d=404')
      } catch (e) {
        if (e.name != 'StatusCodeError') {
          next(e)
        }
        next(new APIError('Unable to use Gravatar'))
      }
    } else {
      next(new APIError('Unable to process image'))
    }
    const oldAvatar = await UserClient.updateAvatarURL(user.email, avatarURL)
    if (oldAvatar) await this.bucket.deleteAvatar(client_id, oldAvatar)
    response.json(error ? { error } : {})
  }

  // TODO: Check for empty or silent clips before uploading.
  saveAvatarClip = async (request: Request, response: Response) => {
    const session = request?.session
    const headers = request?.headers
    const user = request?.session?.user
    const client_id = request?.session?.user?.client_id
    if (!session || !headers || !user || !client_id) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }

    console.log(`VOICE_AVATAR: saveAvatarClip() called, ${client_id}`)
    const folder = client_id
    const clipFileName = folder + '.mp3'
    try {
      // If upload was base64, make sure we decode it first.
      let transcoder
      if ((headers['content-type'] as string).includes('base64')) {
        // If we were given base64, we'll need to concat it all first
        // So we can decode it in the next step.
        console.log(`VOICE_AVATAR: base64 to saveAvatarClip(), ${clipFileName}`)
        const chunks: Buffer[] = []
        await new Promise(resolve => {
          request.on('data', (chunk: Buffer) => {
            chunks.push(chunk)
          })
          request.on('end', resolve)
        })
        const passThrough = new PassThrough()
        passThrough.end(Buffer.from(Buffer.concat(chunks).toString(), 'base64'))
        transcoder = new Transcoder(passThrough)
      } else {
        // For non-base64 uploads, we can just stream data.
        transcoder = new Transcoder(request)
      }

      await pipe(
        streamUploadToBucket,
        Id.ap(getConfig().CLIP_BUCKET_NAME),
        Id.ap(clipFileName),
        Id.ap(transcoder.audioCodec('mp3').format('mp3').stream()),
        TE.getOrElse((e: Error) => T.of(console.log(e)))
      )()

      await UserClient.updateAvatarClipURL(user.email, clipFileName)

      response.json(clipFileName)
    } catch (error) {
      console.error(error)
      response.statusCode = error.statusCode || 500
      response.statusMessage = 'save avatar clip error'
      response.json(error)
    }
  }

  getAvatarClip = async (request: Request, response: Response) => {
    try {
      const user = request?.session?.user
      let path = await UserClient.getAvatarClipURL(user.email)
      path = path[0][0].avatar_clip_url

      const avatarclip = await this.bucket.getAvatarClipsUrl(path)
      response.json(avatarclip)
    } catch (err) {
      response.json(null)
    }
  }

  deleteAvatarClip = async (request: Request, response: Response) => {
    const user = request?.session?.user
    if (!user) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }
    await UserClient.deleteAvatarClipURL(user.email)
    response.json('deleted')
  }

  getTakeouts = async (request: Request, response: Response) => {
    const client_id = request?.session?.user?.client_id
    if (!client_id) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }
    const takeouts = await this.takeout.getClientTakeouts(client_id)
    response.json(takeouts)
  }

  requestTakeout = async (request: Request, response: Response) => {
    const client_id = request?.session?.user?.client_id
    if (!client_id) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }
    try {
      // Throws if there is a pending takeout.
      const takeout_id = await this.takeout.startTakeout(client_id)
      response.json({ takeout_id })
    } catch (err) {
      response.status(StatusCodes.BAD_REQUEST).json(err.message)
    }
  }

  getTakeoutLinks = async (request: Request, response: Response) => {
    const client_id = request?.session?.user?.client_id
    const id = request?.params?.id
    if (!client_id || !id) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }
    const links = await this.takeout.generateDownloadLinks(
      client_id,
      parseInt(id)
    )
    response.json(links)
  }

  getContributionActivity = async (req: Request, response: Response) => {
    // all params are optional
    const { locale } = req.params
    const { client_id } = req?.session?.user || {}
    const { from } = req.query

    response.json(
      await (from == 'you'
        ? this.model.db.getContributionStats(locale, client_id)
        : this.model.getContributionStats(locale))
    )
  }

  createCustomGoal = async (request: Request, response: Response) => {
    const userId = request?.session?.user?.client_id
    if (!userId)
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'no user client id' })

    await CustomGoal.create(userId, request.params.locale, request.body)
    response.json({})
    Basket.sync(request.session.user.client_id).catch(e => console.error(e))
  }

  getGoals = async (request: Request, response: Response) => {
    const client_id = request?.session?.user?.client_id
    if (!client_id) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }
    // locale is optional
    const locale = request?.params?.locale
    return response.json({ globalGoals: await getGoals(client_id, locale) })
  }

  claimUserClient = async (request: Request, response: Response) => {
    const client_id = request?.session?.user?.client_id
    const params = request?.params
    if (!(await UserClient.hasSSO(params.client_id)) && client_id) {
      await UserClient.claimContributions(client_id, [params.client_id])
    }
    response.json({})
  }

  insertDownloader = async (request: Request, response: Response) => {
    const locale = request?.body?.locale
    const email = request?.body?.email
    const dataset = request?.body?.dataset
    if (!locale || !email || !dataset) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }
    await this.model.db.insertDownloader(locale, email, dataset)
    response.json({})
  }

  seenAwards = async (request: Request, response: Response) => {
    const client_id = request?.session?.user?.client_id
    if (!client_id) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }
    await Awards.seen(
      client_id,
      Object.prototype.hasOwnProperty.call(request.query, 'notification')
        ? 'notification'
        : 'award'
    )
    response.json({})
  }

  //
  // Utilities
  //

  getPublicUrl = async (request: Request, response: Response) => {
    const path = request?.params?.path
    if (!path) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }
    const bucket_type = request?.params?.bucket_type
    const url = await this.bucket.getPublicUrl(
      decodeURIComponent(path),
      bucket_type
    )
    response.json({ url })
  }

  getJob = async (request: Request, response: Response, next: NextFunction) => {
    const client_id = request?.session?.user?.client_id
    const jobId = request?.params?.jobId
    if (!client_id || !jobId) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }
    try {
      const job = await NotificationQueue.getJob(jobId)
      //job is owned by current client
      if (job && client_id === job.data.client_id) {
        const { finishedOn } = job
        return response.json({ finishedOn })
      }
      throw new APIError('Invalid job request')
    } catch (e) {
      next(e)
    }
  }

  getServerDate = (request: Request, response: Response) => {
    // prevents contributors manipulating dates in client
    response.json(new Date())
  }
}
