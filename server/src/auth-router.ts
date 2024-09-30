import { AES, enc } from 'crypto-js'
import { NextFunction, Request, Response } from 'express'
const PromiseRouter = require('express-promise-router')
import * as session from 'express-session'
const MySQLStore = require('express-mysql-session')(session)
import UserClient from './lib/model/user-client'
import DB from './lib/model/db'
import { earnBonus } from './lib/model/achievements'
import { getConfig } from './config-helper'
import { ChallengeTeamToken, ChallengeToken } from 'common'
import { Issuer, errors } from 'openid-client'
import { generators } from 'openid-client'

const {
  ENVIRONMENT,
  MYSQLHOST,
  MYSQLDBNAME,
  MYSQLUSER,
  MYSQLPASS,
  PROD,
  SECRET,
  FXA: { DOMAIN, CLIENT_ID, CLIENT_SECRET },
} = getConfig()
const CALLBACK_URL = '/callback'

const getCallbackUrl = (): string => {
  const environments = {
    prod: 'https://commonvoice.mozilla.org',
    stage: 'https://commonvoice.allizom.org',
    sandbox: 'https://sandbox.commonvoice.allizom.org',
  }

  return (
    (environments[ENVIRONMENT as keyof typeof environments] || '') +
    CALLBACK_URL
  )
}

const setupAuthRouter = async () => {
  const router = PromiseRouter()
  const fxaIssuer = await Issuer.discover('https://accounts.stage.mozaws.net')
  const client = new fxaIssuer.Client({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uris: [getCallbackUrl()],
    response_types: ['code'],
    token_endpoint_auth_method: 'client_secret_post',
  })

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

  router.get('/login', (req: Request, res: Response) => {
    const auth = {
      codeVerifier: generators.codeVerifier(),
      state: generators.state(64),
    }

    req.session.auth = auth

    const redirectUri = client.authorizationUrl({
      scope: 'profile',
      // code_challenge: generators.codeChallenge(auth.codeVerifier),
      // code_challenge_method: 'S256',
      state: auth.state,
    })

    console.log({ redirectUri })
    // can pass state here as well
    res.redirect(redirectUri)
  })

  router.get(CALLBACK_URL, async (req: Request, res: Response) => {
    const params = client.callbackParams(req)
    console.log('Parameters: %j', params)
    console.log('Callback auth state: %j', req.session.auth)
    try {
      const tokenSet = await client.callback(getCallbackUrl(), params, {
        // code_verifier: req.session.auth.codeVerifier,
        state: req.session.auth.state,
      })
      console.log('received and validated tokens %j', tokenSet)
      console.log('validated ID Token claims %j', tokenSet.claims())
      res.send('worked')
    } catch (err) {
      if (err instanceof errors.OPError) {
        console.log('OP error: ', {
          err: err.error,
          desc: err.error_description,
          resp: err.response,
          stack: err.stack,
        })
      } else {
        console.log('client callback failed', err)
      }
      res.send('kaputt')
    }
  })

  router.get('/logout', (request: Request, response: Response) => {
    response.clearCookie('connect.sid')
    response.redirect('/')
  })

  return router
}

export default setupAuthRouter

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
