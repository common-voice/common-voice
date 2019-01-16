import { isProduction } from '../utility';

declare const ga: any;

function track(
  category:
    | 'Home'
    | 'Home-New'
    | 'Recording'
    | 'Listening'
    | 'Profile'
    | 'Languages'
    | 'Data'
    | 'Sharing'
    | 'Dashboard'
    | 'Global',
  action: string,
  locale?: string
) {
  if (isProduction() && typeof ga === 'function') {
    ga('send', 'event', category, action, locale);
  }
}

export function trackGlobal(
  action: 'change-language' | 'github' | 'discourse' | 'contact',
  locale?: string
) {
  track('Global', action, locale);
}

export function trackHome(
  action:
    | 'speak'
    | 'listen'
    | 'read-more'
    | 'metric-locale-change'
    | 'change-benefits-tabs'
    | 'click-whats-public-item'
    | 'click-benefits-item'
    | 'click-benefits-register',
  locale?: string
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
    | 'give-avatar'
) {
  track('Profile', action);
}

export function trackLanguages(
  action:
    | 'open-request-language-modal'
    | 'contribute'
    | 'see-more'
    | 'see-less',
  locale?: string
) {
  track('Languages', action, locale);
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

export function trackSharing(channel: 'facebook' | 'twitter' | 'link') {
  track('Sharing', channel);
}

export function trackDashboard(
  action:
    | 'speak-cta'
    | 'listen-cta'
    | 'change-language'
    | 'leaderboard-load-more'
) {
  track('Dashboard', action);
}
