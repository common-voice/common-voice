import { AES, enc } from 'crypto-js'
import * as passport from 'passport'
import { NextFunction, Request, Response } from 'express'
const PromiseRouter = require('express-promise-router')
import * as session from 'express-session'
const MySQLStore = require('express-mysql-session')(session)
import UserClient from './lib/model/user-client'
import DB from './lib/model/db'
import { earnBonus } from './lib/model/achievements'
import { getConfig } from './config-helper'
import { ChallengeTeamToken, ChallengeToken } from 'common'
import { Issuer, Strategy } from 'openid-client'

const {
  ENVIRONMENT,
  MYSQLHOST,
  MYSQLDBNAME,
  MYSQLUSER,
  MYSQLPASS,
  PROD,
  SECRET,
  FXA: { OP, CLIENT_ID, CLIENT_SECRET },
} = getConfig()
const CALLBACK_URL = '/callback'

const setupRouter = async () => {
  await initFxAStrategy()
  const router = PromiseRouter()
  router.use(require('cookie-parser')())
  router.use(
    session({
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: PROD,
      },
      secret: SECRET,
      store: new MySQLStore({
        host: MYSQLHOST,
        user: MYSQLUSER,
        password: MYSQLPASS,
        database: MYSQLDBNAME,
        createDatabaseTable: false,
      }),
      proxy: true,
      resave: false,
      saveUninitialized: false,
    })
  )

  passport.serializeUser((user: any, done: Function) => done(null, user))
  passport.deserializeUser((sessionUser: any, done: Function) =>
    done(null, sessionUser)
  )

  router.use(passport.initialize())
  router.use(passport.session())

  router.get(
    CALLBACK_URL,
    passport.authenticate('FxA', { failureRedirect: '/login' }),
    async (request: Request, response: Response) => {
      console.log('Successful callback')
      const {
        user,
        query: { state },
        session,
      } = request

      let currentState = {
        locale: '',
        old_user: '',
        old_email: '',
        redirect: '',
        enrollment: { challenge: '', team: '', invite: '', referer: '' },
      }

      if (state && typeof state === 'string') {
        const bytes = AES.decrypt(state, SECRET)
        const decryptedData = bytes.toString(enc.Utf8)
        currentState = JSON.parse(decryptedData)
      }

      const { locale, old_user, old_email, redirect, enrollment } = currentState

      const basePath = locale ? `/${locale}/` : '/'
      if (!user) {
        response.redirect(basePath + 'login-failure')
      } else if (old_user) {
        const success = await UserClient.updateSSO(
          old_email,
          user.emails[0].value
        )
        if (!success) {
          session.passport.user = old_user
        }
        response.redirect('/profile/settings?success=' + success.toString())
      } else if (enrollment?.challenge && enrollment?.team) {
        if (
          !(await UserClient.enrollRegisteredUser(
            user.emails[0].value,
            enrollment.challenge as ChallengeToken,
            enrollment.team as ChallengeTeamToken,
            enrollment.invite,
            enrollment.referer
          ))
        ) {
          // if the user is unregistered, pass enrollment to frontend
          user.enrollment = enrollment
        } else {
          // if the user is already registered, now they should be enrolled
          // [TODO] there should be an elegant way to get the client_id here
          const client_id = await UserClient.findClientId(user.emails[0].value)
          await earnBonus('sign_up_first_three_days', [
            enrollment.challenge,
            client_id,
          ])
          await earnBonus('invite_signup', [
            client_id,
            enrollment.invite,
            enrollment.invite,
            enrollment.challenge,
          ])
        }

        // [BUG] try refresh the challenge board, toast will show again, even though DB won't give it the same achievement again
        response.redirect(
          redirect ||
            `${basePath}login-success?challenge=${enrollment.challenge}&achievement=1`
        )
      } else {
        response.redirect(redirect || basePath + 'login-success')
      }
    }
  )

  router.get(
    '/login',
    (request: Request, response: Response, next: NextFunction) => {
      const { headers, user, query } = request
      let locale = 'en'
      if (headers.referer) {
        const refererUrl = new URL(headers.referer)
        locale = refererUrl.pathname.split('/')[1] || 'en'
      }
      passport.authenticate('FxA', {
        state: AES.encrypt(
          JSON.stringify({
            locale,
            ...(user && query.change_email !== undefined
              ? {
                  old_user: request.user,
                  old_email: user.emails[0].value,
                }
              : {}),
            redirect: query.redirect || null,
            enrollment: {
              challenge: query.challenge || null,
              team: query.team || null,
              invite: query.invite || null,
              referer: query.referer || null,
            },
          }),
          SECRET
        ).toString(),
      })(request, response, next)
    }
  )

  router.get('/logout', (request: Request, response: Response) => {
    response.clearCookie('connect.sid')
    response.redirect('/')
  })

  return router
}

const getCallbackURL = (env: string): string => {
  if (!['sandbox', 'stage', 'prod'].includes(env)) {
    return CALLBACK_URL
  }

  const BASE_URLS = {
    stage: 'https://commonvoice.allizom.org',
    prod: 'https://commonvoice.mozilla.org',
    sandbox: 'https://sandbox.commonvoice.allizom.org',
  } as any

  return BASE_URLS[env] + CALLBACK_URL
}

const initFxAStrategy = async () => {
  if (OP) {
    try {
      const fxaIssuer = await Issuer.discover(
        'https://accounts.stage.mozaws.net'
      )
      const client = new fxaIssuer.Client({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uris: [getCallbackURL(ENVIRONMENT)],
      })
      const strategy = new Strategy(
        { client: client, params: { scope: 'openid email' }, usePKCE: false },
        (tokenSet: any, userInfo: any, done: any) => {
          console.log('authenticated >>>', { userInfo })
          done(null, userInfo)
        }
      )

      passport.use('FxA', strategy)
    } catch (error) {
      console.error('Failed to initialize FxA strategy:', error)
    }
  } else {
    console.log('No FxA configuration found')
  }
}

export default setupRouter()

const db = new DB()
export async function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (request.user) {
    const accountClientId = await UserClient.findClientId(
      request.user.emails[0].value
    )
    if (accountClientId) {
      request.client_id = accountClientId
      return next()
    }
  }

  const [authType, credentials] = (request.header('Authorization') || '').split(
    ' '
  )

  if (authType !== 'Basic') {
    return next()
  }

  const [client_id, auth_token] = Buffer.from(credentials, 'base64')
    .toString()
    .split(':')

  if (await UserClient.hasSSO(client_id)) {
    return response.sendStatus(401)
  } else {
    const verified = await db.createOrVerifyUserClient(client_id, auth_token)
    if (!verified) {
      return response.sendStatus(401)
    }
  }

  request.client_id = client_id

  return next()
}
