import { Request, Response } from 'express';
const PromiseRouter = require('express-promise-router');
import fetchMetrics from './lib/model/metrics';
import { getConfig } from './config-helper';

const adminEmails = JSON.parse(getConfig().ADMIN_EMAILS);

const router = PromiseRouter();

router.get('/admin', async ({ user }: Request, response: Response) => {
  if (!user || !user.emails) {
    response.redirect('/login');
    return;
  }
  if (!user.emails.find(({ value }: any) => adminEmails.includes(value))) {
    response.sendStatus(401);
    return;
  }
  response.json(await fetchMetrics());
});

export { router };
