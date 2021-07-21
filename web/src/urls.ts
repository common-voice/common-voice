const PROFILE = '/profile';
const DASHBOARD = '/dashboard';
const DEMO = '/demo';

export default Object.freeze({
  ROOT: '',

  RECORD: '/record', // old, here for redirect purposes
  SPEAK: '/speak',
  LISTEN: '/listen',

  PROFILE,
  PROFILE_INFO: PROFILE + '/info',
  PROFILE_AVATAR: PROFILE + '/avatar',
  PROFILE_SETTINGS: PROFILE + '/settings',
  PROFILE_DELETE: PROFILE + '/delete',

  DASHBOARD,
  STATS: '/stats',
  PROFILE_GOALS: PROFILE + '/goals', // old, here for redirect purposes
  GOALS: '/goals',
  AWARDS: '/awards',
  CHALLENGE: '/challenge',

  DATA: '/data', // old, here for redirect purposes
  DATASETS: '/datasets',

  FAQ: '/faq',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  CHALLENGE_TERMS: '/challenge-terms',
  LANGUAGES: '/languages',
  ABOUT: '/about',

  DEMO,
  INTRO: DEMO,
  DEMO_DATASETS: DEMO + '/datasets',
  DEMO_DASHBOARD: DEMO + '/dashboard',
  DEMO_SPEAK: DEMO + '/speak',
  DEMO_LISTEN: DEMO + '/listen',
  DEMO_ACCOUNT: DEMO + '/create-profile',
  DEMO_CONTRIBUTE: DEMO + '/contribute',
  TARGET_SEGMENT_INFO:
    'https://discourse.mozilla.org/t/help-create-common-voices-first-target-segment/59587',
  TARGET_SEGMENT_INFO_ES:
    'https://discourse.mozilla.org/t/ayuda-a-crear-el-primer-objetivo-segmentado-de-common-voice/60472/',

  HTTP_ROOT: 'https://commonvoice.mozilla.org',
  STAGING_ROOT: 'https://commonvoice.allizom.org',
  GITHUB_ROOT: 'https://github.com/mozilla/common-voice',

  S3_BUCKET:
    'https://voice-prod-bundler-ee1969a6ce8178826482b88e843c335139bd3fb4.s3.amazonaws.com',
  S3_CDN: 'https://cdn.commonvoice.mozilla.org',
});
