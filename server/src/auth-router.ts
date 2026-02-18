import { ChallengeTeamToken, ChallengeToken } from 'common'
import { AES, enc } from 'crypto-js'
import { CookieOptions, NextFunction, Request, Response } from 'express'
import * as session from 'express-session'
import { Issuer } from 'openid-client'
import { getConfig } from './config-helper'
import {
  CALLBACK_URL,
  COMMON_VOICE_DOMAIN_MAP,
  callbackURL,
} from './infrastructure/authentication/authentication'
import { earnBonus } from './lib/model/achievements'
import DB from './lib/model/db'
import UserClient from './lib/model/user-client'
import * as jwt from 'jsonwebtoken'
import * as cookieParser from 'cookie-parser'

const PromiseRouter = require('express-promise-router')
const MySQLStore = require('express-mysql-session')(session)

const {
  ENVIRONMENT,
  MYSQLHOST,
  MYSQLDBNAME,
  MYSQLUSER,
  MYSQLPASS,
  PROD,
  SECRET,
  JWT_KEY,
  FXA: { DOMAIN, CLIENT_ID, CLIENT_SECRET },
} = getConfig()

const COOKIE_MAX_AGE_30_DAYS = 30 * 24 * 60 * 60 * 1000

export const setupAuthRouter = async () => {
  const fxaIssuer = await Issuer.discover(DOMAIN)
  const client = new fxaIssuer.Client({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uris: [callbackURL(ENVIRONMENT)],
    response_types: ['code'],
    token_endpoint_auth_method: 'client_secret_post',
  })

  const router = PromiseRouter()

  router.use(cookieParser())
  router.use(
    session({
      cookie: {
        maxAge: COOKIE_MAX_AGE_30_DAYS,
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

  router.get('/login', (req: Request, res: Response) => {
    const {
      headers,
      query,
      session: { user },
    } = req
    const locale = headers.referer
      ? getLocaleFromReferrer(headers.referer)
      : 'en'

    const state = AES.encrypt(
      JSON.stringify({
        locale,
        ...(user && query.change_email !== undefined
          ? {
              old_user: user,
              old_email: user.email,
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
    ).toString()

    req.session.auth = {
      state,
    }

    res.redirect(
      client.authorizationUrl({
        scope: 'openid email profile',
        state,
      })
    )
  })

  router.get(CALLBACK_URL, async (request: Request, response: Response) => {
    const params = client.callbackParams(request)
    if (!request.session.auth) {
      return response.redirect('/login-failure')
    }
    const { state } = request.session.auth

    const tokenSet = await client.callback(callbackURL(ENVIRONMENT), params, {
      state,
    })

    const { email } = await client.userinfo(tokenSet.access_token)
    request.session.user = { ...request.session.user, email }

    const user = request.session.user

    let currentState = {
      locale: '',
      old_user: {
        email: '',
        client_id: '',
      },
      old_email: '',
      redirect: '',
      enrollment: { challenge: '', team: '', invite: '', referer: '' },
    }

    const bytes = AES.decrypt(state, SECRET)
    const decryptedData = bytes.toString(enc.Utf8)
    currentState = JSON.parse(decryptedData)
    const { locale, old_user, old_email, redirect, enrollment } = currentState
    const basePath = locale ? `/${locale}/` : '/'
    if (!user) {
      response.redirect(basePath + 'login-failure')
    } else if (old_user) {
      const success = await UserClient.updateSSO(old_email, user.email)
      if (!success) {
        request.session.user = old_user
      }
      response.redirect('/profile/settings?success=' + success.toString())
    } else if (enrollment?.challenge && enrollment?.team) {
      if (
        !(await UserClient.enrollRegisteredUser(
          user.email,
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
        const client_id = await UserClient.findClientId(user.email)

        response.cookie(
          'mcv_session',
          jwt.sign(createJwtPayload(client_id, false), JWT_KEY),
          createSessionCookieOptions()
        )

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
      // Check if user has an account (registered user)
      const client_id = await UserClient.findClientId(user.email)

      // For new users (no client_id), don't use redirect - they need to complete profile first
      // The login-success page will handle redirecting them to profile info
      if (client_id) {
        // Existing user - honor the redirect
        response.redirect(redirect || basePath + 'login-success')
      } else {
        // New user - ignore redirect, let them set up profile first
        // Store the redirect in session storage via query param for later use
        const redirectParam = redirect
          ? `?intended_redirect=${encodeURIComponent(redirect)}`
          : ''
        response.redirect(basePath + 'login-success' + redirectParam)
      }
    }
  })

  router.get('/logout', (request: Request, response: Response) => {
    response.clearCookie('connect.sid')
    response.clearCookie('mcv_session')
    response.redirect('/')
  })

  return router
}

const db = new DB()
export async function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (request.session.user) {
    const accountClientId = await UserClient.findClientId(
      request.session.user.email
    )
    if (accountClientId) {
      request.session.user.client_id = accountClientId
      response.cookie(
        'mcv_session',
        jwt.sign(createJwtPayload(accountClientId, false), JWT_KEY),
        createSessionCookieOptions()
      )
      next()
      return
    }
  }

  const [authType, credentials] = (request.header('Authorization') || '').split(
    ' '
  )
  if (authType === 'Basic') {
    const [client_id, auth_token] = Buffer.from(credentials, 'base64')
      .toString()
      .split(':')
    if (await UserClient.hasSSO(client_id)) {
      response.sendStatus(401)
      return
    } else {
      const verified = await db.createOrVerifyUserClient(client_id, auth_token)
      if (!verified) {
        response.sendStatus(401)
        return
      }
    }

    response.cookie(
      'mcv_session',
      jwt.sign(createJwtPayload(client_id, true), JWT_KEY),
      createSessionCookieOptions()
    )

    request.session.user = { ...request.session.user, client_id }
  }

  next()
}

function createJwtPayload(
  clientId: string,
  anonymous: boolean
): { sub: string; iss: string; aud: string; anonymous: boolean } {
  return {
    iss: COMMON_VOICE_DOMAIN_MAP[ENVIRONMENT],
    aud: COMMON_VOICE_DOMAIN_MAP[ENVIRONMENT],
    sub: clientId,
    anonymous,
  }
}

function createSessionCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: PROD,
    maxAge: COOKIE_MAX_AGE_30_DAYS,
  }
}

function getLocaleFromReferrer(referrer: string) {
  const refererUrl = new URL(referrer)
  const locale = refererUrl.pathname.split('/')[1] || 'en'

  if (locale.includes('spontaneous-speech')) {
    return 'en'
  }

  return locale
}
