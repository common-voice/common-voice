const fs = require('fs');
const path = require('path');
const request = require('request-promise-native');

const TRANSLATED_MIN_PROGRESS = 0.95;
const CONTRIBUTABLE_MIN_SENTENCES = 1000;

const dataPath = path.join(__dirname, '..', 'locales');

function saveDataJSON(name, data) {
  fs.writeFileSync(
    path.join(dataPath, name + '.json'),
    JSON.stringify(data, null, 2)
  );
}

async function fetchPontoonLanguages() {
  const { data } = await request({
    uri: 'https://pontoon.mozilla.org/graphql',
    method: 'POST',
    json: true,
    body: {
      query: `{
            project(slug: "common-voice") {
              localizations {
                totalStrings
                approvedStrings
                locale {
                  code
                  name
                }
              }
            }
          }`,
      variables: null,
    },
  });
  return data.project.localizations
    .map(({ totalStrings, approvedStrings, locale }) => [
      locale.code,
      locale.name,
      approvedStrings / totalStrings,
    ])
    .concat([['en', 'English', 1]])
    .sort(([code1], [code2]) => code1.localeCompare(code2));
}

async function saveToMessages(languages) {
  const messagesPath = path.join(
    __dirname,
    '..',
    'web',
    'locales',
    'en',
    'messages.ftl'
  );
  const messages = fs.readFileSync(messagesPath, 'utf-8');
  const newMessages = messages.replace(
    /#\s\[Languages]([\s\S]*?)#\s\[\/]/gm,
    [
      '# [Languages]',
      '## Languages',
      languages.map(([code, name]) => `${code} = ${name}`).join('\n'),
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
          .filter(
            ([code, name, progress]) => progress >= TRANSLATED_MIN_PROGRESS
          )
          .map(l => l[0]),
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
      languages.reduce((obj, [k, v]) => {
        obj[k] = v;
        return obj;
      }, {})
    ),
    saveCompletedLocalesJSON(languages),
  ]);
}

async function importContributableLocales() {
  const sentencesPath = path.join(__dirname, '..', 'server', 'data');
  const names = fs.readdirSync(sentencesPath).filter(name => {
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
    return count > CONTRIBUTABLE_MIN_SENTENCES;
  });
  saveDataJSON('contributable', names.sort(), null, 2);
}

async function importLocales() {
  await Promise.all([importPontoonLocales(), importContributableLocales()]);
}

importLocales().catch(e => console.error(e));
