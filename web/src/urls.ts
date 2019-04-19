const PROFILE_ROOT = '/profile';
export default Object.freeze({
  ROOT: '',

  RECORD: '/record', // old, here for redirect purposes
  SPEAK: '/speak',
  LISTEN: '/listen',

  PROFILE: PROFILE_ROOT,
  PROFILE_INFO: PROFILE_ROOT + '/info',
  PROFILE_AVATAR: PROFILE_ROOT + '/avatar',
  PROFILE_SETTINGS: PROFILE_ROOT + '/settings',
  PROFILE_DELETE: PROFILE_ROOT + '/delete',

  DASHBOARD: '/dashboard', // old, here for redirect purposes
  STATS: '/stats',
  PROFILE_GOALS: PROFILE_ROOT + '/goals', // old, here for redirect purposes
  GOALS: '/goals',
  AWARDS: '/awards',

  DATA: '/data', // old, here for redirect purposes
  DATASETS: '/datasets',

  FAQ: '/faq',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  NOTFOUND: '/not-found',
  LANGUAGES: '/languages',
  ABOUT: '/about',
});
