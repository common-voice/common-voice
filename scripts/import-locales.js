const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const { parse } = require('@fluent/syntax');
const fetch = require('node-fetch');
const { promisify } = require('util');
const { getConfig } = require('../server/js/config-helper');
const TRANSLATED_MIN_PROGRESS = 0.75;

const dataPath = path.join(__dirname, '..', 'locales');
const localeMessagesPath = path.join(__dirname, '..', 'web', 'locales');

const { MYSQLHOST, MYSQLUSER, MYSQLPASS, MYSQLDBNAME } = getConfig();

const dbConfig = {
  host: MYSQLHOST,
  user: MYSQLUSER,
  password: MYSQLPASS,
  database: MYSQLDBNAME,
};

function saveDataJSON(name, data) {
  fs.writeFileSync(
    path.join(dataPath, name + '.json'),
    JSON.stringify(data, null, 2) + '\n'
  );
}

async function fetchPontoonLanguages() {
  const url =
    'https://pontoon.mozilla.org/graphql?query={project(slug:%22common-voice%22){localizations{totalStrings,approvedStrings,locale{code,name,direction}}}}';
  const response = await fetch(url);
  const { data } = await response.json();

  return data.project.localizations
    .map(({ totalStrings, approvedStrings, locale }) => ({
      code: locale.code,
      name: locale.name,
      direction: locale.direction,
      translated: approvedStrings / totalStrings,
    }))
    .concat({ code: 'en', name: 'English', translated: 1, direction: 'LTR' })
    .sort((l1, l2) => l1.code.localeCompare(l2.code));
}

async function saveToMessages(languages) {
  const messagesPath = path.join(localeMessagesPath, 'en', 'messages.ftl');
  const messages = fs.readFileSync(messagesPath, 'utf-8');
  const newMessages = messages.replace(
    /#\s\[Languages]([\s\S]*?)#\s\[\/]/gm,
    [
      '# [Languages]',
      '## Languages',
      languages.map(({ code, name }) => `${code} = ${name}`).join('\n'),
      '# [/]',
    ].join('\n')
  );
  fs.writeFileSync(messagesPath, newMessages);
}

/**
 * Saves completed locales (always merges with previously added locales)
 */
async function saveCompletedLocalesJSON(languages) {
  const fileName = 'translated';
  const completedLocalesPath = path.join(dataPath, fileName + '.json');
  const existingLocales = JSON.parse(
    fs.readFileSync(completedLocalesPath, 'utf-8')
  );
  saveDataJSON(
    fileName,
    [
      ...new Set([
        ...existingLocales,
        ...languages
          .filter(l => l.translated >= TRANSLATED_MIN_PROGRESS)
          .map(l => l.code),
      ]),
    ].sort()
  );
}

async function importPontoonLocales() {
  const languages = await fetchPontoonLanguages();
  await Promise.all([
    saveToMessages(languages),
    saveDataJSON(
      'all',
      languages.map(l => l.code)
    ),
    saveDataJSON(
      'rtl',
      languages
        .filter(l => l.direction === 'RTL')
        .map(l => l.code)
        .sort()
    ),
    saveCompletedLocalesJSON(languages),
  ]);
}

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

async function buildLocaleNativeNameMapping() {
  const locales = fs.readdirSync(localeMessagesPath);
  const nativeNames = {};
  for (const locale of locales) {
    const messagesPath = path.join(localeMessagesPath, locale, 'messages.ftl');

    if (!fs.existsSync(messagesPath)) {
      continue;
    }

    const messages = parse(fs.readFileSync(messagesPath, 'utf-8'));
    const message = messages.body.find(
      message => message.id && message.id.name === locale
    );

    nativeNames[locale] = message ? message.value.elements[0].value : locale;
  }
  saveDataJSON('native-names', nativeNames);
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

importLocales().catch(e => console.error(e));
