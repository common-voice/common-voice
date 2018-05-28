const fs = require('fs');
const path = require('path');
const request = require('request-promise-native');

const PROGRESS_THRESHOLD = 0.95;

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
          .filter(([code, name, progress]) => progress >= PROGRESS_THRESHOLD)
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
  const names = (await new Promise(resolve =>
    fs.readdir(sentencesPath, (_, names) => resolve(names))
  )).filter(name => name !== 'LICENSE');
  saveDataJSON('contributable', names.sort(), null, 2);
}

async function importLocales() {
  await Promise.all([importPontoonLocales(), importContributableLocales()]);
}

importLocales().catch(e => console.error(e));
