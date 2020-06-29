const releases = [
  'cv-corpus-4-2019-12-10',
  'cv-corpus-5-singleword',
  'cv-corpus-5-2020-06-22',
];

export default releases.reduce((statsObj: any, releaseName) => {
  const { stats } = require(`./releases/${releaseName}`);
  statsObj[releaseName] = stats;
  return statsObj;
}, {});;