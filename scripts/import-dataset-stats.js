const path = require('path');
const mysql = require('mysql');
const { parse } = require('@fluent/syntax');
const fetch = require('node-fetch');
const { promisify } = require('util');
const { getConfig } = require('../server/js/config-helper');
const dataPath = path.join(__dirname, '..', 'locales');
const localeMessagesPath = path.join(__dirname, '..', 'web', 'locales');
const fs = require('fs').promises;

const RELEASE_DIR_PATH = path.join(__dirname, 'releases');

const RELEASE_TYPES = {
  complete: 'complete',
  singleword: 'singleword',
  delta: 'delta',
};

const { MYSQLHOST, MYSQLUSER, MYSQLPASS, MYSQLDBNAME } = getConfig();

const dbConfig = {
  host: MYSQLHOST,
  user: MYSQLUSER,
  password: MYSQLPASS,
  database: MYSQLDBNAME,
};

const TOTAL_STATS = ['totalDuration', 'totalValidDurationSecs'];

const secondsToMilliseconds = seconds => seconds * 1000;

const getTotalStats = statistics => {
  return TOTAL_STATS.map(key => statistics[key]);
};

async function getDatasetId(db, values) {
  try {
    const [{ id }] = await db(
      `
      SELECT id FROM datasets
      WHERE release_dir = ?
    `,
      [...values]
    );
    return id;
  } catch (error) {
    console.log(error);
  }
}

async function getLocaleIds(db) {
  try {
    const rows = await db(
      `
      SELECT id,name FROM locales
    `
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
}

async function insertLocaleStats(db, values) {
  try {
    return await db(
      `
      INSERT INTO locale_datasets
      SET dataset_id = ?,
          locale_id = ?,
          total_clips_duration = ?,
          valid_clips_duration = ?,
          average_clips_duration = ?,
          total_users = ?,
          size = ?,
          checksum = ?
    `,
      [...values]
    );
  } catch (error) {
    console.log(error);
  }
}

async function loadStatisticFiles(db) {
  const releaseFilePaths = await fs.readdir(RELEASE_DIR_PATH);

  for (const releaseFilePath of releaseFilePaths) {
    const statisticsPath = path.join(RELEASE_DIR_PATH, releaseFilePath);

    // get the type of dataset release from
    const releaseType =
      Object.keys(RELEASE_TYPES).find(word => releaseFilePath.includes(word)) ||
      RELEASE_TYPES.complete;

    const release_dir = releaseFilePath.split('.json')[0];
    const datasetId = await getDatasetId(db, [release_dir]);

    console.log('Migrating statistics for : ', release_dir);

    const statistics = JSON.parse(await fs.readFile(statisticsPath, 'utf-8'));

    //save total dataset stats to db
    let totalReleaseStats = getTotalStats(statistics);
    totalReleaseStats[1] = secondsToMilliseconds(totalReleaseStats[1]);
    const { bundleURLTemplate, bundleURL } = statistics;
    const download_path = bundleURLTemplate || bundleURL;
    totalReleaseStats = [
      ...totalReleaseStats,
      releaseType,
      download_path,
      release_dir,
    ];

    //save individual languages stats to db per dataset
    const { locales } = statistics;
    let localeIds = await getLocaleIds(db);

    //format response to get dictory of name:id of locales
    localeIds = localeIds.reduce((obj, row) => {
      obj[row.name] = row.id;
      return obj;
    }, {});

    try {
      if (!datasetId) {
        throw new Error('No datasetID found');
      }

      await Promise.all(
        Object.keys(locales).map(async locale => {
          const localeId = localeIds[locale];
          if (!localeId || !locale) {
            return;
            // throw new Error('No localeId found for ', locale);
          }

          const stats = locales[locale];

          let {
            duration,
            validDurationSecs,
            avgDurationSecs,
            users,
            size,
            checksum,
          } = stats;

          if (releaseType === RELEASE_TYPES.singleword) {
            size = statistics.overall.size;
            checksum = statistics.overall.checksum;
          }

          return insertLocaleStats(db, [
            datasetId,
            localeIds[locale],
            duration <= 0 ? 0 : duration,
            validDurationSecs <= 0
              ? 0
              : secondsToMilliseconds(validDurationSecs),
            avgDurationSecs <= 0 ? 0 : secondsToMilliseconds(avgDurationSecs),
            users,
            size < 0 ? 0 : size, //no negatives
            checksum,
          ]);
        })
      );
    } catch (error) {
      console.log(error);
    }
  }
}

async function importDatasetStatistics() {
  try {
    const pool = mysql.createPool(dbConfig);

    pool.getConnection(async (err, connection) => {
      if (err) throw err;
      const db = promisify(connection.query).bind(connection);
      let locales = {};

      await loadStatisticFiles(db);

      connection.destroy();
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
importDatasetStatistics().catch(e => console.error(e));
