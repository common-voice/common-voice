import { isProduction } from '../utility';

declare const ga: any;

function track(
  category:
    | 'Home'
    | 'Home-New'
    | 'Navigation'
    | 'Recording'
    | 'Listening'
    | 'Profile'
    | 'Data'
    | 'Sharing',
  action: string,
  locale?: string
) {
  if (isProduction() && typeof ga === 'function') {
    ga('send', 'event', category, action, locale);
  }
}

export function trackHome(
  action: 'speak' | 'listen' | 'read-more',
  locale: string
) {
  track('Home', action, locale);
}

export function trackHomeNew(
  action: 'speak' | 'listen' | 'read-more' | 'metric-locale-change',
  locale: string
) {
  track('Home-New', action, locale);
}

export function trackRecording(
  action:
    | 'record'
    | 'submit'
    | 'rerecord'
    | 'view-shortcuts'
    | 'shortcut'
    | 'skip'
    | 'listen',
  locale: string
) {
  track('Recording', action, locale);
}

export function trackListening(
  action:
    | 'listen'
    | 'listen-home'
    | 'vote-yes'
    | 'vote-no'
    | 'view-shortcuts'
    | 'shortcut'
    | 'skip',
  locale: string
) {
  track('Listening', action, locale);
}

export function trackProfile(
  action:
    | 'give-email'
    | 'give-username'
    | 'give-accent'
    | 'give-age'
    | 'give-gender'
) {
  track('Profile', action);
}

export function trackDataset(
  action: string
  //   | 'open-modal'
  //   | 'open-bundle-modal'
  //   | 'download-{datasetname}
  //   | 'download-bundle'
  //   | 'post-download-signup'
) {
  track('Data', action);
}

export function trackNavigation(action: 'progress-to-record') {
  track('Navigation', action);
}

export function trackSharing(channel: 'facebook' | 'twitter' | 'link') {
  track('Sharing', channel);
}
