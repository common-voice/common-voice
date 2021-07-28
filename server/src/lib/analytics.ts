import * as analytics from 'universal-analytics';
import { getConfig } from '../config-helper';
import { hashClientId } from './utility';

const GA_ID_PROD = 'UA-194612451-2';
const GA_ID_DEV = 'UA-194612451-1';

const gaId = getConfig().ENVIRONMENT == 'prod' ? GA_ID_PROD : GA_ID_DEV;

export function trackPageView(path: string, client_id: string) {
  analytics(gaId, { uid: hashClientId(client_id) })
    .pageview(path)
    .send();
}
