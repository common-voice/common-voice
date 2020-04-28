import * as analytics from 'universal-analytics';
import { getConfig } from '../config-helper';
import { hashClientId } from './utility';

const GA_ID = 'UA-101237170-1';

export function trackPageView(path: string, client_id: string) {
  if (getConfig().ENVIRONMENT == 'prod') {
    analytics(GA_ID, { uid: hashClientId(client_id) })
      .pageview(path)
      .send();
  } else {
    console.log('analytics event (not tracked here)', 'pageView', path);
  }
}
