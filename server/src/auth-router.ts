const Auth0Strategy = require('passport-auth0');
import { Request, Response } from 'express';
const PromiseRouter = require('express-promise-router');
import * as session from 'express-session';
const MySQLStore = require('express-mysql-session')(session);
import * as passport from 'passport';
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
  ({ user }: Request, response: Response) => {
    if (!user) {
      throw new Error('user null');
    }
    response.redirect('/admin');
  }
);

router.get(
  '/login',
  passport.authenticate('auth0', {}),
  (request: Request, response: Response) => {
    response.redirect('/admin');
  }
);

export default router;
