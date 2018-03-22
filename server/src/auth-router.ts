const Auth0Strategy = require('passport-auth0');
import { Request, Response } from 'express';
const PromiseRouter = require('express-promise-router');
import * as session from 'express-session';
const MySQLStore = require('express-mysql-session')(session);
import * as passport from 'passport';
import { getConfig } from './config-helper';

const {
  MYSQLHOST,
  MYSQLDBNAME,
  MYSQLUSER,
  MYSQLPASS,
  AUTH0: { DOMAIN, CLIENT_ID, CLIENT_SECRET },
} = getConfig();
const CALLBACK_URL = '/callback';

const router = PromiseRouter();

router.use(passport.initialize());
router.use(
  session({
    // TODO use real secret
    secret: 'unique-snowflake',
    store: new MySQLStore({
      host: MYSQLHOST,
      user: MYSQLUSER,
      password: MYSQLPASS,
      database: MYSQLDBNAME,
      createDatabaseTable: false,
    }),
    resave: false,
    saveUninitialized: false,
  })
);
router.use(passport.session());

passport.serializeUser((user: any, done: Function) => done(null, user));
passport.deserializeUser((sessionUser: any, done: Function) =>
  done(null, sessionUser)
);

const strategy = new Auth0Strategy(
  {
    domain: DOMAIN,
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
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

router.get(
  CALLBACK_URL,
  passport.authenticate('auth0', { failureRedirect: '/login' }),
  (request: Request, response: Response) => {
    const user = (request as any).user;
    console.log(user);
    if (!user) {
      throw new Error('user null');
    }
    response.redirect('/');
  }
);

router.get(
  '/login',
  passport.authenticate('auth0', {}),
  (request: Request, response: Response) => {
    response.redirect('/');
  }
);

export default router;
