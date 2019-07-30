const PROFILE = '/profile';
const DASHBOARD = '/dashboard';
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

  DATA: '/data', // old, here for redirect purposes
  DATASETS: '/datasets',

  FAQ: '/faq',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  NOTFOUND: '/not-found',
  LANGUAGES: '/languages',
  ABOUT: '/about',
});
