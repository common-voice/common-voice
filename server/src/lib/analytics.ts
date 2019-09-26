import * as crypto from 'crypto';
import * as analytics from 'universal-analytics';
import { getConfig } from '../config-helper';

const GA_ID = 'UA-101237170-1';

/**
 * Needs to behave like the client side version in /web/src/utility.ts
 */
function hash(text: string) {
  return crypto
    .createHash('sha256')
    .update(text)
    .digest('hex');
}

export function trackPageView(path: string, client_id: string) {
  if (getConfig().ENVIRONMENT == 'prod') {
    analytics(GA_ID, { uid: hash(client_id) })
      .pageview(path)
      .send();
  } else {
    console.log('analytics event (not tracked here)', 'pageView', path);
  }
}
