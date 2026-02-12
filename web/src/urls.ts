const PROFILE = '/profile'
const DASHBOARD = '/dashboard'
const DEMO = '/demo'
const SPONTANEOUS_SPEECH = '/spontaneous-speech/beta'
export const SPONTANEOUS_SPEECH_ROOT_URL = `${window.location.origin}${SPONTANEOUS_SPEECH}`

export default Object.freeze({
  ABOUT: '/about',
  AWARDS: '/awards',
  CHALLENGE: '/challenge',
  CHALLENGE_TERMS: '/challenge-terms',
  CHECK_TRANSCRIPT: SPONTANEOUS_SPEECH_ROOT_URL + '/check-transcript',
  CRITERIA: '/criteria',
  DASHBOARD,
  DATA: '/data', // old, here for redirect purposes
  DATASETS:
    'https://datacollective.mozillafoundation.org/organization/cmfh0j9o10006ns07jq45h7xk',
  OLDDATASETS: '/olddatasets',
  DEMO,
  DEMO_ACCOUNT: DEMO + '/create-profile',
  DEMO_CONTRIBUTE: DEMO + '/contribute',
  DEMO_LISTEN: DEMO + '/listen',
  DEMO_SPEAK: DEMO + '/speak',
  FAQ: '/faq',
  GITHUB_ROOT: 'https://github.com/mozilla/common-voice',
  GOALS: '/goals',
  GUIDELINES: '/guidelines',
  HTTP_ROOT: 'https://commonvoice.mozilla.org',
  INTRO: DEMO,
  LANGUAGES: '/languages',
  LANGUAGE_REQUEST: '/language/request',
  LANGUAGE_REQUEST_SUCCESS: '/language/request/success',
  LISTEN: '/listen',
  MDC_ROOT: 'https://datacollective.mozillafoundation.org',
  MDC_DATASETS:
    'https://datacollective.mozillafoundation.org/organization/cmfh0j9o10006ns07jq45h7xk',
  MOZILLA_BLOG_ROOT: 'http://foundation.mozilla.org/blog',
  PARTNER: '/partner',
  PRIVACY: '/privacy',
  PROFILE,
  PROFILE_AVATAR: PROFILE + '/avatar',
  PROFILE_DELETE: PROFILE + '/delete',
  PROFILE_DOWNLOAD: PROFILE + '/download',
  PROFILE_GOALS: PROFILE + '/goals', // old, here for redirect purposes
  PROFILE_INFO: PROFILE + '/info',
  PROFILE_SETTINGS: PROFILE + '/settings',
  PROFILE_API_CREDENTIALS: PROFILE + '/api-credentials',
  PROMPTS: SPONTANEOUS_SPEECH_ROOT_URL + '/prompts',
  QUESTION: SPONTANEOUS_SPEECH_ROOT_URL + '/question',
  RECORD: '/record', // old, here for redirect purposes
  REVIEW: '/review',
  REVIEW_QUESTIONS: SPONTANEOUS_SPEECH_ROOT_URL + '/validate',
  ROOT: '',
  TRANSCRIBE: SPONTANEOUS_SPEECH_ROOT_URL + '/transcribe',
  S3_CDN: 'https://cdn.commonvoice.mozilla.org',
  SENTENCE_COLLECTOR_REDIRECT: '/sentence-collector-redirect',
  SPEAK: '/speak',
  SPONTANEOUS_SPEECH,
  SPONTANEOUS_SPEECH_REDIRECT: '/spontaneous-speech-redirect',
  STAGING_ROOT: 'https://commonvoice.allizom.org',
  STATS: '/stats',
  TARGET_SEGMENT_INFO:
    'https://discourse.mozilla.org/t/help-create-common-voices-first-target-segment/59587',
  TARGET_SEGMENT_INFO_ES:
    'https://discourse.mozilla.org/t/ayuda-a-crear-el-primer-objetivo-segmentado-de-common-voice/60472/',
  TERMS: '/terms',
  WRITE: '/write',
})
