// Note: When you release a new dataset, please make sure to
// add it to the datasets table as well
const releases = [
  'nvc-1.0.1-2021-03-05'
];

export default releases
  .reduce((statsObj: { [key: string]: any }, releaseName: string) => {
    const stats  = require(`./releases/${releaseName}.json`);
    if (!stats.exclude) {
      statsObj[releaseName] = stats;
    }
    return statsObj;
  }, {});
