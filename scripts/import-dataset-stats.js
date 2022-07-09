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

const { MYSQLHOST, MYSQLUSER, MYSQLPASS, MYSQLDBNAME } = getConfig();

const dbConfig = {
  host: MYSQLHOST,
  user: MYSQLUSER,
  password: MYSQLPASS,
  database: MYSQLDBNAME,
};

const TOTAL_STATS = [
  'totalDuration',
  'totalValidDurationSecs',
  'totalHrs',
  'totalValidHrs',
];

async function importContributableLocales(locales) {
  const sentencesPath = path.join(__dirname, '..', 'server', 'data');
  const oldContributable = JSON.parse(
    fs.readFileSync(path.join(dataPath, 'contributable.json'), 'utf-8')
  );
  const names = fs.readdirSync(sentencesPath).filter(name => {
    if (oldContributable.includes(name)) {
      return true;
    }
    if (name === 'LICENSE') {
      return false;
    }
    const localeSentencesPath = path.join(sentencesPath, name);
    const count = fs
      .readdirSync(localeSentencesPath)
      .reduce(
        (count, sentencesFile) =>
          sentencesFile.endsWith('.txt')
            ? count +
              fs
                .readFileSync(
                  path.join(localeSentencesPath, sentencesFile),
                  'utf-8'
                )
                .split('\n').length
            : count,
        0
      );
    return count > locales[name].targetSentenceCount;
  });
  saveDataJSON('contributable', names.sort());
}

const getTotalStats = statistics => {};

async function loadStatisticFiles() {
  const releaseFilePaths = await fs.readdir(RELEASE_DIR_PATH);

  for (const releaseFilePath of releaseFilePaths) {
    const statisticsPath = path.join(RELEASE_DIR_PATH, releaseFilePath);

    const statistics = await fs.readFile(statisticsPath, 'utf-8');
    console.log(statistics);
  }
}

async function importLocales() {
  try {
    const pool = mysql.createPool(dbConfig);

    pool.getConnection(async (err, connection) => {
      if (err) throw err;
      const db = promisify(connection.query).bind(connection);
      let locales = {};

      db(`select * from locales`)
        .then(data => {
          locales = data.reduce((obj, locale) => {
            obj[locale.name] = {
              name: locale.name,
              id: locale.id,
              targetSentenceCount: locale.target_sentence_count,
            };
            return obj;
          }, {});
        })
        .finally(async () => {
          await Promise.all([
            importPontoonLocales(),
            importContributableLocales(locales),
            buildLocaleNativeNameMapping(),
          ]);
          connection.destroy();
        });
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

loadStatisticFiles().catch(e => console.error(e));
