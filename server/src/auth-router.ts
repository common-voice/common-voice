import { AES, enc } from 'crypto-js';
const Auth0Strategy = require('passport-auth0');
import { Request, Response } from 'express';
const PromiseRouter = require('express-promise-router');
import * as session from 'express-session';
const MySQLStore = require('express-mysql-session')(session);
import * as passport from 'passport';
import UserClient from './lib/model/user-client';
import { getConfig } from './config-helper';

const {
  ENVIRONMENT,
  MYSQLHOST,
  MYSQLDBNAME,
  MYSQLUSER,
  MYSQLPASS,
  PROD,
  SECRET,
  AUTH0: { DOMAIN, CLIENT_ID, CLIENT_SECRET },
} = getConfig();
const CALLBACK_URL = '/callback';

const router = PromiseRouter();

router.use(require('cookie-parser')());
router.use(
  session({
    cookie: {
      maxAge: 365 * 24 * 60 * 60,
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
);
router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser((user: any, done: Function) => done(null, user));
passport.deserializeUser((sessionUser: any, done: Function) =>
  done(null, sessionUser)
);

if (DOMAIN) {
  Auth0Strategy.prototype.authorizationParams = function(options: any) {
    var options = options || {};

    const params: any = {};
    if (options.connection && typeof options.connection === 'string') {
      params.connection = options.connection;
    }
    if (options.audience && typeof options.audience === 'string') {
      params.audience = options.audience;
    }
    if (options.prompt && typeof options.prompt === 'string') {
      params.prompt = options.prompt;
    }

    params.action = 'signup';

    return params;
  };

  const strategy = new Auth0Strategy(
    {
      domain: DOMAIN,
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL:
        (({
          stage: 'https://voice.allizom.org',
          prod: 'https://voice.mozilla.org',
        } as any)[ENVIRONMENT] || '') + CALLBACK_URL,
      scope: 'openid email',
    },
    (
      accessToken: any,
      refreshToken: any,
      extraParams: any,
      profile: any,
      done: any
    ) => done(null, profile)
  );

  passport.use(strategy);
} else {
  console.log('No Auth0 configuration found');
}

router.get(
  CALLBACK_URL,
  passport.authenticate('auth0', { failureRedirect: '/login' }),
  async ({ user, query }: Request, response: Response) => {
    if (!user) {
      response.redirect('/login-failure');
    } else if (query.state) {
      const { old_sso_id } = JSON.parse(
        AES.decrypt(query.state, SECRET).toString(enc.Utf8)
      );
      await UserClient.updateSSO(old_sso_id, user.id, user.emails[0].value);
      response.redirect('/profile/preferences');
    } else {
      response.redirect('/login-success');
    }
  }
);

router.get('/login', (request: Request, response: Response) => {
  const { user, query } = request;
  passport.authenticate('auth0', {
    state:
      user && query.change_email !== undefined
        ? AES.encrypt(
            JSON.stringify({ old_sso_id: user.id }),
            SECRET
          ).toString()
        : '',
  } as any)(request, response);
});

router.get('/logout', (request: Request, response: Response) => {
  response.clearCookie('connect.sid');
  response.redirect('/');
});

export default router;
