import { isProduction } from '../utility';

declare const ga: any;

function track(
  category:
    | 'Navigation'
    | 'Recording'
    | 'Listening'
    | 'Profile'
    | 'Data'
    | 'Sharing',
  action: string
) {
  if (isProduction() && typeof ga === 'function') {
    ga('send', 'event', category, action);
  }
}

export function trackRecording(action: 'record' | 'submit' | 'rerecord') {
  track('Recording', action);
}

export function trackListening(
  action: 'listen' | 'vote-yes' | 'vote-no' | 'shortcut'
) {
  track('Listening', action);
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
