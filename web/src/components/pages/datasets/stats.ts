// Note: When you release a new dataset, please make sure to
// add it to the datasets table as well
const releases = [
  'cv-corpus-1',
  'cv-corpus-2',
  'cv-corpus-3',
  'cv-corpus-4-2019-12-10',
  'cv-corpus-5-singleword',
  'cv-corpus-5-2020-06-22',
  'cv-corpus-5.1-2020-06-22',
  'cv-corpus-5.1-singleword',
  'cv-corpus-6.0-2020-12-11',
  'cv-corpus-6.0-singleword',
  'cv-corpus-6.1-2020-12-11',
  'cv-corpus-6.1-singleword',
];

export default releases
  .reverse()
  .reduce((statsObj: { [key: string]: any }, releaseName: string) => {
    const { stats } = require(`./releases/${releaseName}`);
    if (!stats.exclude) {
      statsObj[releaseName] = stats;
    }
    return statsObj;
  }, {});
