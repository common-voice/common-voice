import { PassThrough } from 'stream'
import * as path from 'path'
import * as bodyParser from 'body-parser'
import { MD5 } from 'crypto-js'
import { NextFunction, Request, Response, Router } from 'express'
import * as sendRequest from 'request-promise-native'
import { StatusCodes } from 'http-status-codes'
import PromiseRouter from 'express-promise-router'
import {
  createMp3TranscodeJob,
  type Mp3TranscodeJob,
} from './ffmpeg-transcoder'

import { FEATURES_COOKIE, Sentence, UserClient as UserClientType } from 'common'
import rateLimiter from './middleware/rate-limiter-middleware'
import { authMiddleware } from '../auth-router'
import { RequireUserMiddleware } from './middleware/requireUserMiddleware'
import { HandleFeatureMiddleware } from './middleware/handleFeatureMiddleware'
import { RequireFeatureMiddleware } from './middleware/requireFeatureMiddleware'
import { getConfig } from '../config-helper'
import Awards from './model/awards'
import CustomGoal from './model/custom-goal'
import getGoals from './model/goals'
import UserClient from './model/user-client'
// Basket import removed: bulk-mail facility not supported
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
import { createMd5Hash } from '../infrastructure/crypto/crypto'

type NewNewsletterResponse = {
  message: string
  data: {
    email: string
    newsletters: string[]
  }
}

export default class API {
  model: Model
  clip: Clip
  challenge: Challenge
  email: Email
  statistics: Statistics
  private readonly bucket: Bucket
  readonly takeout: Takeout
  private readonly requireUserMiddleware: RequireUserMiddleware
  private readonly handleFeatureMiddleware: HandleFeatureMiddleware
  private readonly requireFeatureMiddleware: RequireFeatureMiddleware

  constructor(model: Model) {
    this.model = model
    this.clip = new Clip(this.model)
    this.statistics = new Statistics(this.model)
    this.challenge = new Challenge(this.model)
    this.email = new Email()
    this.bucket = new Bucket(this.model)
    this.takeout = new Takeout(this.model.db.mysql, this.bucket)
    this.requireUserMiddleware = new RequireUserMiddleware()
    this.handleFeatureMiddleware = new HandleFeatureMiddleware()
    this.requireFeatureMiddleware = new RequireFeatureMiddleware()
  }

  getRouter(): Router {
    const router = PromiseRouter()

    router.use(authMiddleware)

    // Feature flag handling - should come early to set cookies
    router.use(this.handleFeatureMiddleware.handle)

    // Public endpoints (no authentication required)
    router.use('/', this.getPublicRouter())

    // Protected endpoints (authentication required)
    router.use('/', this.getProtectedRouter())

    router.use('*', (request: Request, response: Response) => {
      response.sendStatus(404)
    })

    return router
  }

  private getPublicRouter(): Router {
    const router = PromiseRouter()

    //
    // System & Health Check
    //

    // Health check endpoint for frontend feature flag detection
    router.get('/ping', (request: Request, response: Response) => {
      response.send('pong')
    })

    // Legacy redirect endpoints
    router.get('/metrics', (request: Request, response: Response) => {
      response.redirect('/')
    })

    router.get('/golem', (request: Request, response: Response) => {
      response.redirect('/')
    })

    //
    // Webhooks (External Service Integrations)
    //

    // Firefox Accounts event webhooks
    router.use('/webhooks', webhooksRouter)

    //
    // User Account - login, signup, profil
    // These are both for logged-in and not logged in users
    // Protection is handled inside the handlers as needed
    //

    // Get current user account details - or null if not logged in
    router.get('/user_client', this.getAccount)

    // Get all user client accounts (for SSO users with multiple clients - return [] if not logged in)
    router.get('/user_clients', this.getUserClients)

    // Save language metadata for anonymous users (accent, variant)
    // Body: languages array
    router.patch(
      '/anonymous_user',
      validate({ body: anonUserMetadataSchema }),
      rateLimiter('/anonymous_user', { points: 1, duration: 60 }),
      this.saveAnonymousAccountLanguages
    )

    //
    // Storage & File Access
    //

    // Get public URL for legacy dataset bucket files (feature-flagged)
    // Params: bucket_type, path
    // TODO: Consider to move this to protected router and add under user profile
    router.get(
      '/bucket/:bucket_type/:path',
      rateLimiter('/bucket', { points: 10, duration: 60 }),
      this.getPublicUrl
    )

    //
    // Languages
    //

    // Get available language variants for a locale
    // Params: locale (optional)
    router.get('/language/variants/:locale?', this.getVariants)

    // Submit request to add a new language to Common Voice
    // Body: email, languageInfo, languageLocale, platforms
    router.post(
      '/language/request',
      rateLimiter('/language/request', { points: 10, duration: 60 }),
      validate({ body: sendLanguageRequestSchema }),
      this.sendLanguageRequest
    )

    // Get list of all language requests
    router.get('/requested_languages', this.getRequestedLanguages)

    // Get available languages for a project (common-voice or spontaneous-speech)
    // Query: project
    router.get(
      '/available_languages',
      validate({ query: projectSchema }),
      this.getAvailableLanguages
    )

    // Get combined language data (All coming from Pontoon, CV/SS/CS - active or not, with variants and predefined accents combined)
    router.get('/languagedata/:locale?', this.getCombinedLanguageData)

    // Get all available languages
    router.get('/languages', this.getAllLanguages)

    // Language-specific endpoints (translations, etc.)
    router.use('/languages/:locale', languagesRouter)

    //
    // Statistics & Analytics
    //

    // Statistics endpoints (clips, speakers, downloads, etc.)
    router.use('/statistics', this.statistics.getRouter())

    // Get contribution activity statistics
    // Query: from (optional - 'you' for user-specific)
    router.get('/contribution_activity', this.getContributionActivity)
    router.get('/:locale/contribution_activity', this.getContributionActivity)

    // Get language-specific statistics
    router.get('/stats/languages/', this.getLanguageStats)

    //
    // Datasets
    //

    // Get all datasets by release type
    // Query: releaseType (singleword|delta|complete)
    router.get(
      '/datasets',
      validate({ query: datasetSchema }),
      this.getAllDatasets
    )

    // Get all languages that have published datasets
    router.get('/datasets/languages', this.getAllLanguagesWithDatasets)

    // Get dataset statistics for specific language
    router.use('/datasets/languages', datasetRouter)

    //
    // Newsletter & Communication
    //

    // Subscribe email to Common Voice newsletter
    // Params: email, Query: language
    router.post('/newsletter/:email', this.subscribeToNewsletter)

    // Track dataset downloads by locale
    // Body: locale, email, dataset
    router.post('/:locale/downloaders', this.insertDownloader)

    //
    // Challenges & Gamification
    //

    // Challenge-related endpoints (points, progress, leaderboards)
    router.use('/challenge', this.challenge.getRouter())

    //
    // Utilities
    //

    // Get current server date/time (prevents client-side date manipulation)
    router.get('/server_date', this.getServerDate)

    return router
  }

  private getProtectedRouter(): Router {
    const router = PromiseRouter()

    // Apply authentication middleware once for all protected routes
    router.use(this.requireUserMiddleware.handle)

    //
    // Background Jobs
    //

    // Get status of background job (e.g., avatar image upload)
    // Params: jobId
    router.get('/job/:jobId', validate({ params: jobSchema }), this.getJob)

    //
    // User Account Management
    //

    // Claim contributions from another client_id
    // Params: client_id
    router.post('/user_clients/:client_id/claim', this.claimUserClient)

    // Update user account settings (email, username, visibility, etc.)
    router.patch('/user_client', this.saveAccount)

    //
    // User Profile - Avatars
    //

    // Upload user avatar (file, gravatar, or default)
    // Params: type (file|gravatar|default)
    router.post(
      '/user_client/avatar/:type',
      bodyParser.raw({ type: 'image/*', limit: '300kb' }),
      this.saveAvatar
    )

    // Upload voice avatar clip
    router.post('/user_client/avatar_clip', this.saveAvatarClip)

    // Get voice avatar clip URL
    router.get('/user_client/avatar_clip', this.getAvatarClip)

    // Delete voice avatar clip
    router.get('/user_client/delete_avatar_clip', this.deleteAvatarClip)

    //
    // User Profile - Goals & Achievements
    //

    // Create custom contribution goal for a locale
    // Params: locale, Body: goal details
    router.post('/user_client/:locale/goals', this.createCustomGoal)

    // Get user's global goals
    router.get('/user_client/goals', this.getGoals)

    // Get user's goals for specific locale
    // Params: locale
    router.get('/user_client/:locale/goals', this.getGoals)

    // Mark awards/notifications as seen
    // Query: notification (optional)
    router.post('/user_client/awards/seen', this.seenAwards)

    //
    // User Profile - Data Takeout (GDPR)
    //

    // Get list of user's data takeout requests
    router.get('/user_client/takeout', this.getTakeouts)

    // Request new data takeout (limited to prevent abuse)
    router.post('/user_client/takeout/request', this.requestTakeout)

    // Get download links for completed takeout
    // Params: id (takeout request ID)
    router.post('/user_client/takeout/:id/links', this.getTakeoutLinks)

    //
    // User Profile - API Credentials
    //

    // API credentials management (under feature flag)
    router.use('/profiles', profilesRouter)

    //
    // Languages (User-Specific)
    //

    // Get user's accent preferences for a locale
    // Params: locale (optional)
    router.get('/language/accents/:locale?', this.getAccents)

    // Create a new language request
    // Body: language
    router.post('/requested_languages', this.createLanguageRequest)

    //
    // Sentences - Contribution
    //

    // Sentence submission and voting (rate-limited in sub-router)
    router.use('/sentences', SentencesRouter)

    // Bulk sentence submission (rate-limited in sub-router)
    router.use('/:locale/bulk_submissions', bulkSubmissionsRouter)

    // Get random sentences to record for a locale
    // Params: locale, Query: count, ignoreClientVariant
    router.get(
      '/:locale/sentences',
      validate({ query: sentenceSchema }),
      this.getRandomSentences
    )

    // Mark sentence as skipped
    // Params: id (sentence_id)
    router.post('/skipped_sentences/:id', this.createSkippedSentence)

    //
    // Clips - Contribution & Validation
    //

    // Clip recording, validation, and statistics
    router.use('/:locale?/clips', this.clip.getRouter())

    // Mark clip as skipped during validation
    // Params: id (clip_id)
    router.post('/skipped_clips/:id', this.createSkippedClip)

    //
    // Content Moderation
    //

    // Report inappropriate content (clips, sentences)
    router.use('/reports', reportsRouter)

    return router
  }

  //
  // Language
  //

  getRequestedLanguages = async (request: Request, response: Response) => {
    response.json(await this.model.db.getRequestedLanguages())
  }

  createLanguageRequest = async (request: Request, response: Response) => {
    const client_id = request.session.user.client_id // Guaranteed by middleware
    const language = request?.body?.language
    if (!language) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }
    await this.model.db.createLanguageRequest(language, client_id)
    response.json({})
  }

  getCombinedLanguageData = async (_request: Request, response: Response) => {
    const locale = _request?.params?.locale
    const allData = await this.model.getCombinedLanguageData()
    if (!locale) {
      return response.json(allData)
    }
    const languageData = allData.filter(ld => ld.code === locale)
    if (languageData?.length === 1) {
      return response.json(languageData[0])
    }
    response.sendStatus(StatusCodes.NOT_FOUND)
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
    const client_id = request.session.user.client_id // Guaranteed by middleware
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
    const client_id = request.session.user.client_id // Guaranteed by middleware
    const locale = request?.params?.locale

    if (!locale) {
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
      // we select max 500 sentences among max 1000 random ones
      // Then drop what the user interacted with
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

      // Finally return what is requested by count
      return response.json(sentences.slice(0, count))
    }

    const sentences = await this.model.findEligibleSentences(
      client_id,
      locale,
      count
    )

    response.json(sentences)
  }

  createSkippedSentence = async (request: Request, response: Response) => {
    const client_id = request.session.user.client_id // Guaranteed by middleware
    const sentence_id = request?.params?.id
    if (!sentence_id) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }
    await this.model.db.createSkippedSentence(sentence_id, client_id)
    response.json({})
  }

  //
  // Clips
  //

  createSkippedClip = async (request: Request, response: Response) => {
    const client_id = request.session.user.client_id // Guaranteed by middleware
    const clip_id = request?.params?.id
    if (!clip_id) {
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
    const client_id = request.session.user.client_id // Guaranteed by middleware
    if (!languages || languages.length === 0) {
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
    const user = request.session.user // Guaranteed by middleware
    if (!body) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }
    response.json(await UserClient.saveAccount(user.email, body))
  }

  getAccount = async (request: Request, response: Response) => {
    // This can be called without user in session
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
    const email = request?.params?.email
    if (!email) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }
    const lang = request?.query?.language || 'en'

    const sourceUrl = request.header('Referer')
    const env = getConfig().ENVIRONMENT
    const listUrl =
      env === 'prod'
        ? 'https://abdri3ttkb.execute-api.us-east-2.amazonaws.com/api/newsletter/commonvoicemozillaorg'
        : ['sandbox', 'stage'].includes(env)
        ? 'https://kmq73rfvbh.execute-api.us-east-2.amazonaws.com/api/newsletter/commonvoicemozillaorg'
        : ''

    if (listUrl === '') {
      console.error(
        'Newsletter subscription is not supported in local development.'
      )
      return response.status(StatusCodes.METHOD_NOT_ALLOWED).json({
        error: 'Newsletter subscription is not supported in local development.',
      })
    }

    try {
      // Make request to new API
      // We don't collect name and country, so we don't pass them
      // We get language from FE API call, 7-8 translated templates exist, with fallback to "en"
      const listResponse = await fetch(listUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          lang: lang,
          source_url: sourceUrl,
        }),
      })

      // Parse the response body
      const responseData: NewNewsletterResponse = await listResponse.json()

      if (!listResponse.ok) {
        // HTTP error (4xx, 5xx)
        console.error(
          '[Newsletter] API HTTP error:',
          listResponse.status,
          responseData
        )

        if (listResponse.status === 400) {
          return response.status(StatusCodes.BAD_REQUEST).json({
            error: `[Newsletter] Invalid request data: ${
              responseData.message || ''
            }`,
          })
        } else if (listResponse.status === 429) {
          return response.status(StatusCodes.TOO_MANY_REQUESTS).json({
            error: `[Newsletter] Too many subscription attempts: ${
              responseData.message || ''
            }`,
          })
        } else {
          return response.status(listResponse.status).json({
            error: `[Newsletter] Subscription failed: ${
              responseData.message || ''
            }`,
          })
        }
      }
      // Still handle it through our old basket system
      // We temporarily have to use hash of the email returned from the newsletter API as token
      // We check it everywhere in the codebase
      // We dont get any token from the newsletter API directly, so we create a hash from the email
      // It is 32 char, so we pad it with "mcv-"" to reach 36 char length of our basket tokens, also indicating its origin
      const hash = createMd5Hash(email)

      void (await UserClient.updateBasketToken(
        email,
        hash.padStart(36, 'mcv-')
      ))
      // await Basket.sync(clientId, true) // Commented out: bulk-mail facility not supported

      // HTTP success (2xx)
      console.debug('[Newsletter] Subscription successful.')
      response.json({})
    } catch (error) {
      console.error('[Newsletter] Subscription failed:', error)

      const apiError = new APIError(
        '[Newsletter] Failed to subscribe to newsletter'
      )
      next(apiError)
    }
  }

  saveAvatar = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const body = request?.body
    const params = request?.params
    const user = request.session.user // Guaranteed by middleware
    const client_id = user.client_id
    if (!body || !params) {
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
    const headers = request?.headers
    const user = request.session.user // Guaranteed by middleware
    const client_id = user.client_id
    if (!headers) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }

    console.log(`VOICE_AVATAR: saveAvatarClip() called, ${client_id}`)
    const folder = client_id
    const clipFileName = folder + '.mp3'

    let inputStream: NodeJS.ReadableStream | null = null
    let transcodeJob: Mp3TranscodeJob | null = null
    let shouldAttachAbortHandler = false

    const abortHandler = () => {
      transcodeJob?.abort()
      request.removeListener('aborted', abortHandler)
    }

    try {
      // If upload was base64, make sure we decode it first.
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
        inputStream = passThrough
      } else {
        // For non-base64 uploads, we can just stream data.
        inputStream = request
        shouldAttachAbortHandler = true
        request.on('aborted', abortHandler)
      }

      if (!inputStream) {
        throw new Error('Missing avatar clip input stream')
      }

      if (request.aborted) {
        throw new Error('Request aborted before transcoding started')
      }

      transcodeJob = await createMp3TranscodeJob(inputStream)

      if (request.aborted) {
        transcodeJob.abort()
        throw new Error('Request aborted before transcoding started')
      }

      const uploadTask = pipe(
        streamUploadToBucket,
        Id.ap(getConfig().CLIP_BUCKET_NAME),
        Id.ap(clipFileName),
        Id.ap(transcodeJob.outputStream),
        TE.getOrElse((e: Error) => T.of(console.log(e)))
      )()

      await Promise.all([uploadTask, transcodeJob.transcodeCompleted])
      transcodeJob = null

      await UserClient.updateAvatarClipURL(user.email, clipFileName)

      response.json(clipFileName)
    } catch (error) {
      transcodeJob?.abort(error instanceof Error ? error : undefined)
      console.error(error)
      const statusCode =
        error && typeof error === 'object' && 'statusCode' in error
          ? Number((error as { statusCode?: number }).statusCode)
          : undefined
      response.statusCode = statusCode || 500
      response.statusMessage = 'save avatar clip error'
      response.json(error)
    } finally {
      if (shouldAttachAbortHandler) {
        request.removeListener('aborted', abortHandler)
      }
    }
  }

  getAvatarClip = async (request: Request, response: Response) => {
    try {
      const user = request.session.user // Guaranteed by middleware
      let path = await UserClient.getAvatarClipURL(user.email)
      path = path[0][0].avatar_clip_url

      const avatarclip = await this.bucket.getAvatarClipsUrl(path)
      response.json(avatarclip)
    } catch (err) {
      response.json(null)
    }
  }

  deleteAvatarClip = async (request: Request, response: Response) => {
    const user = request.session.user // Guaranteed by middleware
    await UserClient.deleteAvatarClipURL(user.email)
    response.json('deleted')
  }

  getTakeouts = async (request: Request, response: Response) => {
    const client_id = request.session.user.client_id // Guaranteed by middleware
    const takeouts = await this.takeout.getClientTakeouts(client_id)
    response.json(takeouts)
  }

  requestTakeout = async (request: Request, response: Response) => {
    const client_id = request.session.user.client_id // Guaranteed by middleware
    try {
      // Throws if there is a pending takeout.
      const takeout_id = await this.takeout.startTakeout(client_id)
      response.json({ takeout_id })
    } catch (err) {
      response.status(StatusCodes.BAD_REQUEST).json(err.message)
    }
  }

  getTakeoutLinks = async (request: Request, response: Response) => {
    const client_id = request.session.user.client_id // Guaranteed by middleware
    const id = request?.params?.id
    if (!id) {
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
    const userId = request.session.user.client_id // Guaranteed by middleware

    await CustomGoal.create(userId, request.params.locale, request.body)
    response.json({})
    // Basket.sync(userId).catch(e => console.error(e)) // Commented out: bulk-mail facility not supported
  }

  getGoals = async (request: Request, response: Response) => {
    const client_id = request.session.user.client_id // Guaranteed by middleware
    // locale is optional
    const locale = request?.params?.locale
    return response.json({ globalGoals: await getGoals(client_id, locale) })
  }

  claimUserClient = async (request: Request, response: Response) => {
    const client_id = request.session.user.client_id // Guaranteed by middleware
    const params = request?.params
    if (!(await UserClient.hasSSO(params.client_id))) {
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
    const client_id = request.session.user.client_id // Guaranteed by middleware
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

    // Check for datasets-old feature flag
    const { feature } = request.query
    const features_cookie = request.cookies[FEATURES_COOKIE]
    const features = features_cookie?.split(',') || []

    const hasFeature =
      features.includes('datasets-old') ||
      (feature &&
        (Array.isArray(feature)
          ? (feature as string[]).includes('datasets-old')
          : feature === 'datasets-old'))

    if (!hasFeature) {
      // Check if request is from a web browser (has Accept header with text/html)
      const acceptHeader = request.get('Accept') || ''
      const isWebBrowser = acceptHeader.includes('text/html')

      if (isWebBrowser) {
        // Redirect web browsers to MDC datasets
        return response.redirect(
          'https://datacollective.mozillafoundation.org/organization/cmfh0j9o10006ns07jq45h7xk'
        )
      } else {
        // Return error for scripts/API clients
        return response.status(403).json({
          message:
            'This endpoint is no longer available. Please visit https://datacollective.mozillafoundation.org/organization/cmfh0j9o10006ns07jq45h7xk to download datasets.',
          error: 'Access restricted',
        })
      }
    }

    // Validate request origin to prevent unauthorized access
    const referer = request.get('Referer') || request.get('Origin') || ''
    const allowedOrigins = [
      'https://commonvoice.mozilla.org', // production
      'https://commonvoice.allizom.org', // staging + sandbox
      'http://localhost',
      'https://localhost',
    ]

    const isLegitimateOrigin = allowedOrigins.some(origin =>
      referer.startsWith(origin)
    )

    if (!isLegitimateOrigin && referer) {
      // If there's a referer but it's not from an allowed origin, reject the request
      return response.status(403).json({
        message: 'Access denied: Invalid origin',
        error: 'Origin validation failed',
      })
    }

    const bucket_type = request?.params?.bucket_type
    const url = await this.bucket.getPublicUrl(
      decodeURIComponent(path),
      bucket_type
    )
    response.json({ url })
  }

  getJob = async (request: Request, response: Response, next: NextFunction) => {
    const client_id = request.session.user.client_id // Guaranteed by middleware
    const jobId = request?.params?.jobId
    if (!jobId) {
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
