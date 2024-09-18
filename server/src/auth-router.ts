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
  FXA: { CLIENT_ID, CLIENT_SECRET },
} = getConfig()
const CALLBACK_URL = '/callback'

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
router.use(passport.initialize())
router.use(passport.session())

passport.serializeUser((user: any, done: Function) => done(null, user))
passport.deserializeUser((sessionUser: any, done: Function) =>
  done(null, sessionUser)
)
if (CLIENT_ID) {
  const issuer = new Issuer({
    authorization_endpoint: 'https://accounts.stage.mozaws.net/authorization',
    introspection_endpoint: 'https://oauth.stage.mozaws.net/v1/introspect',
    issuer: 'https://accounts.stage.mozaws.net',
    jwks_uri: 'https://oauth.stage.mozaws.net/v1/jwks',
    revocation_endpoint: 'https://oauth.stage.mozaws.net/v1/destroy',
    token_endpoint: 'https://oauth.stage.mozaws.net/v1/token',
    userinfo_endpoint: 'https://profile.stage.mozaws.net/v1/profile',
    verify_endpoint: 'https://oauth.stage.mozaws.net/v1/verify',
  })

  const strategy = new Strategy(
    {
      client: new issuer.Client({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        params: {
          scope: 'openid email',
        },
        redirect_uris: [
          ((
            {
              stage: 'https://commonvoice.allizom.org',
              prod: 'https://commonvoice.mozilla.org',
              dev: 'https://dev.voice.mozit.cloud',
              sandbox: 'https://sandbox.commonvoice.allizom.org',
            } as any
          )[ENVIRONMENT] || '') + CALLBACK_URL,
        ],
      }),
      usePKCE: false,
    },
    (tokenSet: any, profile: any, done: any) => done(null, profile)
  )

  passport.use('fxa', strategy)
} else {
  console.log('No FxA configuration found')
}

router.use(
  CALLBACK_URL,
  passport.authenticate('fxa', { failWithError: true }),
  async (request: Request, response: Response) => {
    console.log('Successful FxA authentication')
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

router.use('/login', passport.authenticate('fxa'))

router.get('/logout', (request: Request, response: Response) => {
  response.clearCookie('connect.sid')
  response.redirect('/')
})

export default router

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
    request.client_id = client_id
  }

  next()
}
